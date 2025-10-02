import type { ReactNode } from "react";
import type { TableHeader } from "../../lib/types/common.type";
// Pagination prop-types
type TableProps<T> = {
  columns: TableHeader[];
  row: T[];
};

function Table<T>({ columns, row }: Readonly<TableProps<T>>) {
  return (
    <div className="relative border h-[80vh] bg-background/80 overflow-auto rounded-sm  w-full">
      <table className="w-full overflow-auto h-full">
        <thead className="bg-primary-purple sticky top-0 text-background">
          <tr>
            {columns.map((column) => (
              <th
                key={column.field}
                className="p-2 text-nowrap font-light text-sm"
              >
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {row.length > 0 ? (
            row?.map((rowItem: T, index: number) => {
              const rowData = rowItem as unknown as Record<string, unknown>;
              return (
                <tr key={1 + index}>
                  {columns.map((col: TableHeader, colIndex: number) => {
                    const value = rowData[col.field];
                    return (
                      <td
                        className={`border-b-border-1 dark:border-b-border-dark border-b-1 border-solid py-2 text-sm text-${
                          col?.valueAlign ?? "center"
                        } ${colIndex === 0 ? "w-0.5" : ""} whitespace-nowrap`} // Added whitespace-nowrap to prevent text wrapping
                        key={col.field}
                      >
                        {(value as ReactNode) ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={`pointer-events-none px-4 py-50 text-center text-sm text-gray-500`}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
