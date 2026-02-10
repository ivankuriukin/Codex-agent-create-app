import { render, screen } from '@testing-library/react';

import { TimePicker } from '../TimePicker';

describe('TimePicker', () => {
  it('renders label', () => {
    render(<TimePicker label="Pick time" />);
    expect(screen.getByText('Pick time')).toBeInTheDocument();
  });
});
