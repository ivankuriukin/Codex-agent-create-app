import { render, screen } from '@testing-library/react';

import { Divider } from '../Divider';

describe('Divider', () => {
  it('renders separator', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
