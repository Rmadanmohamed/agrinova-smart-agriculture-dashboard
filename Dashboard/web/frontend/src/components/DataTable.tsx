import type { CsvRow } from '../services/types';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  rows: CsvRow[];
}

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-white/10">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[columns[0]?.key] ?? 'row'}-${index}`}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key] || '--'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
