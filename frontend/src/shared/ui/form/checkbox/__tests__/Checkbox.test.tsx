import { render, screen } from '@testing-library/react';

import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders label', () => {
    render(<Checkbox>Accept</Checkbox>);
    expect(screen.getByText('Accept')).toBeInTheDocument();
  });
});
