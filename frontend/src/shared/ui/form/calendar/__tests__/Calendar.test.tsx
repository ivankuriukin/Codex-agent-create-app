import { render, screen } from '@testing-library/react';

import { Calendar } from '../Calendar';

describe('Calendar', () => {
  it('renders grid', () => {
    render(<Calendar />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
