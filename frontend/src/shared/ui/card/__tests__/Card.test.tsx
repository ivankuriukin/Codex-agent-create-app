import { render, screen } from '@testing-library/react';

import { Card } from '../Card';

describe('Card', () => {
  it('renders sections', () => {
    render(
      <Card header="Header" footer="Footer">
        Body
      </Card>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
