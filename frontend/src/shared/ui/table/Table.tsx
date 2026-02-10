import type { Node } from '@react-types/shared';
import { type ReactNode, useRef } from 'react';
import {
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableHeaderRow,
  useTableRow,
} from 'react-aria';
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  useTableState,
} from 'react-stately';

type ColumnDef = {
  key: string;
  name: ReactNode;
};

type TableProps<T extends { id: string | number }> = {
  columns: ColumnDef[];
  items: T[];
  renderCell: (item: T, columnKey: string) => ReactNode;
  getRowKey?: (item: T) => string | number;
  className?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
};

export function Table<T extends { id: string | number }>({
  columns,
  items,
  renderCell,
  getRowKey,
  className,
  headerRowClassName,
  headerCellClassName,
  rowClassName,
  cellClassName,
}: TableProps<T>) {
  const state = useTableState({
    children: (
      <>
        <TableHeader columns={columns}>
          {(column) => <Column key={column.key}>{column.name}</Column>}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <Row key={String(getRowKey ? getRowKey(item) : item.id)}>
              {(columnKey) => (
                <Cell>{renderCell(item, String(columnKey))}</Cell>
              )}
            </Row>
          )}
        </TableBody>
      </>
    ),
  });
  const ref = useRef<HTMLTableElement>(null);
  const { collection } = state;
  const { gridProps } = useTable({}, state, ref);

  return (
    <table {...gridProps} ref={ref} className={className}>
      <thead>
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow
            key={headerRow.key}
            headerRow={headerRow}
            state={state}
            className={headerRowClassName}
            headerCellClassName={headerCellClassName}
          />
        ))}
      </thead>
      <tbody>
        {[...collection.body.childNodes].map((row) => (
          <TableRow
            key={row.key}
            row={row}
            state={state}
            className={rowClassName}
            cellClassName={cellClassName}
          />
        ))}
      </tbody>
    </table>
  );
}

type HeaderRowProps = {
  headerRow: Node<unknown>;
  state: ReturnType<typeof useTableState>;
  className?: string;
  headerCellClassName?: string;
};

function TableHeaderRow({
  headerRow,
  state,
  className,
  headerCellClassName,
}: HeaderRowProps) {
  const ref = useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableHeaderRow({ node: headerRow }, state, ref);

  return (
    <tr {...rowProps} ref={ref} className={className}>
      {[...headerRow.childNodes].map((column) => (
        <TableColumnHeader
          key={column.key}
          column={column}
          state={state}
          className={headerCellClassName}
        />
      ))}
    </tr>
  );
}

type ColumnHeaderProps = {
  column: Node<unknown>;
  state: ReturnType<typeof useTableState>;
  className?: string;
};

function TableColumnHeader({ column, state, className }: ColumnHeaderProps) {
  const ref = useRef<HTMLTableCellElement>(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );

  return (
    <th {...columnHeaderProps} ref={ref} className={className}>
      {column.rendered}
    </th>
  );
}

type RowProps = {
  row: Node<unknown>;
  state: ReturnType<typeof useTableState>;
  className?: string;
  cellClassName?: string;
};

function TableRow({ row, state, className, cellClassName }: RowProps) {
  const ref = useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableRow({ node: row }, state, ref);

  return (
    <tr {...rowProps} ref={ref} className={className}>
      {[...row.childNodes].map((cell) => (
        <TableCell
          key={cell.key}
          cell={cell}
          state={state}
          className={cellClassName}
        />
      ))}
    </tr>
  );
}

type CellProps = {
  cell: Node<unknown>;
  state: ReturnType<typeof useTableState>;
  className?: string;
};

function TableCell({ cell, state, className }: CellProps) {
  const ref = useRef<HTMLTableCellElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);

  return (
    <td {...gridCellProps} ref={ref} className={className}>
      {cell.rendered}
    </td>
  );
}
