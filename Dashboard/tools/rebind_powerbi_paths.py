"""Create portable copies of tracked TMDL definitions; never change original PBIX/PBIP files."""
import argparse
import re
from pathlib import Path, PureWindowsPath

ROOT = Path(__file__).resolve().parents[2]
MODEL_ROOTS = (
    Path('Dashboard/powerbi/AgriNova/AgriNova.SemanticModel/definition'),
    Path('powerbi-semantic-model/definition'),
)
CSV_REFERENCE = re.compile(r'File\.Contents\("((?:[^"]|"")*)"\)', re.IGNORECASE)

def rebind_text(text, data_dir):
    count = 0
    def replace(match):
        nonlocal count
        source = match.group(1).replace('""', '"')
        filename = PureWindowsPath(source.replace('/', '\\')).name
        if not filename.lower().endswith('.csv'):
            return match.group(0)
        target = data_dir / filename
        if not target.is_file():
            raise FileNotFoundError(f'Required CSV missing: {filename}')
        count += 1
        escaped = str(target.resolve()).replace('"', '""')
        return f'File.Contents("{escaped}")'
    return CSV_REFERENCE.sub(replace, text), count

def build_portable_copy(repo_root, data_dir, output_dir):
    repo_root, data_dir, output_dir = map(lambda p: Path(p).expanduser().resolve(), (repo_root, data_dir, output_dir))
    if output_dir.exists():
        raise FileExistsError('Choose a new output directory; existing files are not overwritten.')
    if not data_dir.is_dir():
        raise FileNotFoundError('Data directory does not exist.')
    planned = []
    count = 0
    for model_root in MODEL_ROOTS:
        source_dir = repo_root / model_root
        if not source_dir.is_dir():
            raise FileNotFoundError(f'Missing tracked model definition: {model_root}')
        for source in sorted(source_dir.rglob('*.tmdl')):
            text, changed = rebind_text(source.read_text(encoding='utf-8-sig'), data_dir)
            planned.append((source.relative_to(repo_root), text))
            count += changed
    if not count:
        raise ValueError('No CSV file references found.')
    output_dir.mkdir(parents=True)
    for relative, text in planned:
        destination = output_dir / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(text, encoding='utf-8')
    return len(planned), count

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data-dir', type=Path, default=ROOT / 'data')
    parser.add_argument('--output-dir', type=Path, required=True)
    args = parser.parse_args()
    files, references = build_portable_copy(ROOT, args.data_dir, args.output_dir)
    print(f'Created {files} TMDL copies with {references} CSV path bindings. Power BI refresh not performed.')

if __name__ == '__main__':
    main()
