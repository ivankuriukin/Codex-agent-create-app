import { type ElementType, type ReactNode } from 'react';

type CardProps<T extends ElementType = 'section'> = {
  as?: T;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
};

export function Card<T extends ElementType = 'section'>({
  as,
  header,
  footer,
  children,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}: CardProps<T>) {
  const Component = as ?? 'section';

  return (
    <Component className={className}>
      {header ? <div className={headerClassName}>{header}</div> : null}
      {children ? <div className={bodyClassName}>{children}</div> : null}
      {footer ? <div className={footerClassName}>{footer}</div> : null}
    </Component>
  );
}
