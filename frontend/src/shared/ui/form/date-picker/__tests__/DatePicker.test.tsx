import { render, screen } from '@testing-library/react';

import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  it('renders label', () => {
    render(<DatePicker label="Pick date" />);
    expect(screen.getByText('Pick date')).toBeInTheDocument();
  });
});
