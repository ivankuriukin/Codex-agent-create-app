import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders fallback', () => {
    function Boom() {
      throw new Error('Boom');
      return null;
    }

    render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });
});
