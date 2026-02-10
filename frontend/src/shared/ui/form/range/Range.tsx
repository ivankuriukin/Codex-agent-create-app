import { useSliderState } from '@react-stately/slider';
import { type ReactNode, type RefObject, useRef } from 'react';
import { useNumberFormatter, useSlider, useSliderThumb } from 'react-aria';

type RangeProps = {
  label?: ReactNode;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  outputClassName?: string;
} & Omit<Parameters<typeof useSliderState>[0], 'numberFormatter'>;

export function Range({
  label,
  className,
  trackClassName,
  thumbClassName,
  outputClassName,
  ...props
}: RangeProps) {
  const numberFormatter = useNumberFormatter();
  const state = useSliderState({ ...props, numberFormatter });
  const trackRef = useRef<HTMLDivElement>(null);
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(
    { label },
    state,
    trackRef,
  );

  return (
    <div {...groupProps} className={className}>
      {label ? <span {...labelProps}>{label}</span> : null}
      <div {...trackProps} ref={trackRef} className={trackClassName}>
        {state.values.map((_, index) => (
          <Thumb
            key={index}
            index={index}
            state={state}
            trackRef={trackRef}
            className={thumbClassName}
          />
        ))}
      </div>
      <output {...outputProps} className={outputClassName}>
        {`${state.getThumbValueLabel(0)} – ${state.getThumbValueLabel(1)}`}
      </output>
    </div>
  );
}

type ThumbProps = {
  index: number;
  state: ReturnType<typeof useSliderState>;
  trackRef: RefObject<HTMLDivElement | null>;
  className?: string;
};

function Thumb({ index, state, trackRef, className }: ThumbProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { thumbProps, inputProps, isDragging, isFocused } = useSliderThumb(
    { index, trackRef: trackRef as RefObject<HTMLDivElement>, inputRef },
    state,
  );

  return (
    <div
      {...thumbProps}
      className={className}
      data-dragging={isDragging}
      data-focused={isFocused}
    >
      <input {...inputProps} ref={inputRef} />
    </div>
  );
}
