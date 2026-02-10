import { render, screen } from '@testing-library/react';

import { Range } from '../Range';

describe('Range', () => {
  it('renders label', () => {
    render(
      <Range
        label="Range"
        minValue={0}
        maxValue={100}
        defaultValue={[10, 20]}
      />,
    );
    expect(screen.getByText('Range')).toBeInTheDocument();
  });
});
