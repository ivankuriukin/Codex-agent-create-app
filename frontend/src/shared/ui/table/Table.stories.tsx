import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from './Table';

type Item = {
  id: string;
  name: string;
  role: string;
};

const meta: Meta<typeof Table<Item>> = {
  title: 'UI/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table<Item>>;

export const Default: Story = {
  args: {
    columns: [
      { key: 'name', name: 'Name' },
      { key: 'role', name: 'Role' },
    ],
    items: [
      { id: '1', name: 'Ada', role: 'Engineer' },
      { id: '2', name: 'Linus', role: 'Maintainer' },
    ],
    renderCell: (item, columnKey) => item[columnKey as keyof Item],
    getRowKey: (item) => item.id,
  },
};
