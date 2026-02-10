import { type ElementType, type ReactNode } from "react";

type TextProps<T extends ElementType = "span"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
};

export function Text<T extends ElementType = "span">({
  as,
  children,
  className,
}: TextProps<T>) {
  const Component = as ?? "span";
  return <Component className={className}>{children}</Component>;
}
