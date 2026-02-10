import { render, screen } from '@testing-library/react';

import { Select } from '../Select';

describe('Select', () => {
  it('renders label', () => {
    render(<Select label="Team" items={[{ id: 'alpha', label: 'Alpha' }]} />);
    expect(screen.getByText('Team')).toBeInTheDocument();
  });
});
