import { type ReactNode, useRef } from "react";
import { useDateSegment, useTimeField } from "react-aria";
import { useTimeFieldState } from "react-stately";

type TimePickerProps = {
  label?: ReactNode;
  className?: string;
  fieldClassName?: string;
  segmentClassName?: string;
} & Parameters<typeof useTimeFieldState>[0];

export function TimePicker({
  label,
  className,
  fieldClassName,
  segmentClassName,
  ...props
}: TimePickerProps) {
  const state = useTimeFieldState(props);
  const ref = useRef<HTMLDivElement>(null);
  const { labelProps, fieldProps } = useTimeField({ ...props, label }, state, ref);

  return (
    <div className={className}>
      {label ? <span {...labelProps}>{label}</span> : null}
      <div {...fieldProps} ref={ref} className={fieldClassName}>
        {state.segments.map((segment, index) => (
          <TimeSegment key={index} segment={segment} state={state} className={segmentClassName} />
        ))}
      </div>
    </div>
  );
}

type TimeSegmentProps = {
  segment: any;
  state: ReturnType<typeof useTimeFieldState>;
  className?: string;
};

function TimeSegment({ segment, state, className }: TimeSegmentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <span {...segmentProps} ref={ref} className={className}>
      {segment.text}
    </span>
  );
}
