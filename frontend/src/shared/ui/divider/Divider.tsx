import { type HTMLAttributes } from 'react';

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: 'horizontal' | 'vertical';
};

export function Divider({
  orientation = 'horizontal',
  ...props
}: DividerProps) {
  return <hr {...props} role="separator" aria-orientation={orientation} />;
}
