import { render, screen } from '@testing-library/react';

import { Group } from '../Group';

describe('Group', () => {
  it('renders content', () => {
    render(<Group label="Group">Content</Group>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
