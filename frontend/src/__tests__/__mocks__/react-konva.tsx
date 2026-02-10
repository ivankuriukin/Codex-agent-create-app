import type { ReactNode } from 'react';

export const Stage = ({ children }: { children: ReactNode }) => (
  <div data-testid="stage">{children}</div>
);

export const Layer = ({ children }: { children: ReactNode }) => (
  <div data-testid="layer">{children}</div>
);

export const Rect = () => <div data-testid="rect" />;
