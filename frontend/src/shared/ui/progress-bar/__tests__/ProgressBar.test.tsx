import { render, screen } from '@testing-library/react';

import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders label', () => {
    render(
      <ProgressBar label="Progress" value={20} minValue={0} maxValue={100} />,
    );
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });
});
