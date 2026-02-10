import { render, screen } from '@testing-library/react';

import { Menu } from '../Menu';

describe('Menu', () => {
  it('renders trigger', () => {
    render(<Menu triggerLabel="Open" items={[{ id: 'one', label: 'One' }]} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
