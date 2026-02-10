import { render, screen } from '@testing-library/react';

import { TextArea } from '../TextArea';

describe('TextArea', () => {
  it('renders label', () => {
    render(<TextArea label="About" />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
