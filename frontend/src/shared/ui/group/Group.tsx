import { type ReactNode } from 'react';

type GroupProps = {
  children?: ReactNode;
  className?: string;
  label?: string;
};

export function Group({ children, className, label }: GroupProps) {
  return (
    <div className={className} role="group" aria-label={label}>
      {children}
    </div>
  );
}
