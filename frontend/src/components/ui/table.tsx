import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableBodyProps {
  children: React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}

export const Table = ({ children, className = '' }: TableProps) => (
  <div className="overflow-x-auto">
    <table className={`w-full border-collapse ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }: TableHeaderProps) => (
  <thead className="bg-gray-100 border-b-2 border-gray-300">
    {children}
  </thead>
);

// Alias for compatibility
export const TableHead = TableHeader;

export const TableBody = ({ children }: TableBodyProps) => (
  <tbody>{children}</tbody>
);

export const TableRow = ({ children, className = '' }: TableRowProps) => (
  <tr className={`border-b border-gray-200 hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({
  children,
  className = '',
  header = false
}: TableCellProps) =>
  header ? (
    <th className={`px-4 py-3 text-left text-sm font-semibold text-gray-900 ${className}`}>
      {children}
    </th>
  ) : (
    <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>
      {children}
    </td>
  );
