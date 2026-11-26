import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'Dashboard/tools/rebind_powerbi_paths.py'
spec = importlib.util.spec_from_file_location('rebind', SCRIPT)
rebind = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rebind)

class PortabilityTests(unittest.TestCase):
    def test_rebind_without_mutating_source(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            data = root / 'data'
            data.mkdir()
            (data / 'Farms.csv').write_text('FarmID\n1\n')
            for model in rebind.MODEL_ROOTS:
                folder = root / model
                folder.mkdir(parents=True)
                (folder / 'Farms.tmdl').write_text(r'Source = File.Contents("D:\old\Farms.csv")')
            output = root / 'out'
            self.assertEqual(rebind.build_portable_copy(root, data, output), (2, 2))
            for model in rebind.MODEL_ROOTS:
                self.assertIn(str((data / 'Farms.csv').resolve()), (output / model / 'Farms.tmdl').read_text())
                self.assertIn(r'D:\old\Farms.csv', (root / model / 'Farms.tmdl').read_text())
            with self.assertRaises(FileExistsError):
                rebind.build_portable_copy(root, data, output)

    def test_missing_csv_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(FileNotFoundError):
                rebind.rebind_text(r'File.Contents("D:\old\missing.csv")', Path(tmp))

if __name__ == '__main__':
    unittest.main()
