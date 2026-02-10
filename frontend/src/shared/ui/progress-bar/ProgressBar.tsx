import { type ReactNode, useRef } from 'react';
import { useProgressBar } from 'react-aria';

type ProgressBarProps = {
  value?: number;
  minValue?: number;
  maxValue?: number;
  isIndeterminate?: boolean;
  label?: ReactNode;
  className?: string;
  barClassName?: string;
};

export function ProgressBar({
  value,
  minValue,
  maxValue,
  isIndeterminate,
  label,
  className,
  barClassName,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { progressBarProps, labelProps } = useProgressBar({
    value,
    minValue,
    maxValue,
    isIndeterminate,
    label,
  });

  const percentage =
    typeof value === 'number' &&
    typeof minValue === 'number' &&
    typeof maxValue === 'number'
      ? ((value - minValue) / (maxValue - minValue)) * 100
      : undefined;

  return (
    <div {...progressBarProps} ref={ref} className={className}>
      {label ? <span {...labelProps}>{label}</span> : null}
      <div
        className={barClassName}
        style={
          percentage !== undefined ? { width: `${percentage}%` } : undefined
        }
      />
    </div>
  );
}
