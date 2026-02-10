import { render, screen } from '@testing-library/react';

import { Switch } from '../Switch';

describe('Switch', () => {
  it('renders label', () => {
    render(<Switch>Enable</Switch>);
    expect(screen.getByText('Enable')).toBeInTheDocument();
  });
});
