import { render, screen } from '@testing-library/react';

import { TextField } from '../TextField';

describe('TextField', () => {
  it('renders label', () => {
    render(<TextField label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });
});
