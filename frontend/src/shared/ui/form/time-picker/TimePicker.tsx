import { type ReactNode, useRef } from 'react';
import { useDateSegment, useLocale, useTimeField } from 'react-aria';
import { useTimeFieldState } from 'react-stately';

type TimePickerProps = {
  label?: ReactNode;
  locale?: string;
  className?: string;
  fieldClassName?: string;
  segmentClassName?: string;
} & Omit<Parameters<typeof useTimeFieldState>[0], 'locale'>;

export function TimePicker({
  label,
  className,
  fieldClassName,
  segmentClassName,
  ...props
}: TimePickerProps) {
  const { locale: localeFromContext } = useLocale();
  const { locale: localeProp, ...restProps } = props;
  const locale = localeProp ?? localeFromContext ?? 'en-US';
  const state = useTimeFieldState({ ...restProps, locale });
  const ref = useRef<HTMLDivElement>(null);
  const { labelProps, fieldProps } = useTimeField(
    { ...restProps, label },
    state,
    ref,
  );

  return (
    <div className={className}>
      {label ? <span {...labelProps}>{label}</span> : null}
      <div {...fieldProps} ref={ref} className={fieldClassName}>
        {state.segments.map((segment, index) => (
          <TimeSegment
            key={index}
            segment={segment}
            state={state}
            className={segmentClassName}
          />
        ))}
      </div>
    </div>
  );
}

type TimeSegmentProps = {
  segment: ReturnType<typeof useTimeFieldState>['segments'][number];
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
