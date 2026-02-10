import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { WizardSpriteComposer } from '../WizardSpriteComposer';

jest.mock('react-konva', () => ({
  Stage: ({ children }: { children: ReactNode }) => (
    <div data-testid="stage">{children}</div>
  ),
  Layer: ({ children }: { children: ReactNode }) => (
    <div data-testid="layer">{children}</div>
  ),
  Rect: () => <div data-testid="rect" />,
}));

describe('WizardSpriteComposer', () => {
  it('renders controls', () => {
    render(<WizardSpriteComposer />);
    expect(screen.getByText('Голова')).toBeInTheDocument();
  });
});
