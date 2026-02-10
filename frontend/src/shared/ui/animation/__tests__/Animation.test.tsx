import { render, screen } from '@testing-library/react';

import { Animation } from '../Animation';

describe('Animation', () => {
  it('renders content', () => {
    render(<Animation.Appear>Animated</Animation.Appear>);
    expect(screen.getByText('Animated')).toBeInTheDocument();
  });
});
