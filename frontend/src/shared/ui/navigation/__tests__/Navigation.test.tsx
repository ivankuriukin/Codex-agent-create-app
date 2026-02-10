import { render, screen } from '@testing-library/react';

import { Navigation } from '../Navigation';

describe('Navigation', () => {
  it('renders items', () => {
    render(<Navigation items={[{ id: 'home', label: 'Home', href: '#' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
