import { render, screen } from '@testing-library/react';

import { Table } from '../Table';

type Item = { id: string; name: string; role: string };

describe('Table', () => {
  it('renders rows', () => {
    render(
      <Table<Item>
        columns={[
          { key: 'name', name: 'Name' },
          { key: 'role', name: 'Role' },
        ]}
        items={[{ id: '1', name: 'Ada', role: 'Engineer' }]}
        renderCell={(item, key) => item[key as keyof Item]}
        getRowKey={(item) => item.id}
      />,
    );
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });
});
