import { render, screen } from '@testing-library/react';

import { Collapser } from '../Collapser';

describe('Collapser', () => {
  it('renders title', () => {
    render(<Collapser title="Toggle">Hidden</Collapser>);
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });
});
