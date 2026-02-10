import { type ReactNode } from 'react';

type TagProps = {
  children?: ReactNode;
  className?: string;
  onRemove?: () => void;
  removeLabel?: string;
};

export function Tag({
  children,
  className,
  onRemove,
  removeLabel = 'Remove',
}: TagProps) {
  return (
    <span className={className}>
      {children}
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={removeLabel}>
          ×
        </button>
      ) : null}
    </span>
  );
}

type TagsProps = {
  children?: ReactNode;
  className?: string;
};

export function Tags({ children, className }: TagsProps) {
  return <div className={className}>{children}</div>;
}
