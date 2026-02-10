import { render, screen } from '@testing-library/react';

import { Text } from '../Text';

describe('Text', () => {
  it('renders text', () => {
    render(<Text>Sample</Text>);
    expect(screen.getByText('Sample')).toBeInTheDocument();
  });
});
