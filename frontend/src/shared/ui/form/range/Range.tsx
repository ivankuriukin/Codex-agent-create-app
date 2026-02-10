import { type ReactNode, type RefObject, useRef } from "react";
import { useNumberFormatter, useRangeSlider, useSliderThumb } from "react-aria";
import { useRangeSliderState } from "react-stately";

type RangeProps = {
  label?: ReactNode;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  outputClassName?: string;
} & Parameters<typeof useRangeSliderState>[0];

export function Range({
  label,
  className,
  trackClassName,
  thumbClassName,
  outputClassName,
  ...props
}: RangeProps) {
  const numberFormatter = useNumberFormatter();
  const state = useRangeSliderState({ ...props, numberFormatter });
  const trackRef = useRef<HTMLDivElement>(null);
  const { groupProps, trackProps, labelProps, outputProps } = useRangeSlider(
    { label },
    state,
    trackRef
  );

  return (
    <div {...groupProps} className={className}>
      {label ? <span {...labelProps}>{label}</span> : null}
      <div {...trackProps} ref={trackRef} className={trackClassName}>
        <Thumb index={0} state={state} trackRef={trackRef} className={thumbClassName} />
        <Thumb index={1} state={state} trackRef={trackRef} className={thumbClassName} />
      </div>
      <output {...outputProps} className={outputClassName}>
        {`${state.getThumbValueLabel(0)} – ${state.getThumbValueLabel(1)}`}
      </output>
    </div>
  );
}

type ThumbProps = {
  index: number;
  state: ReturnType<typeof useRangeSliderState>;
  trackRef: RefObject<HTMLDivElement>;
  className?: string;
};

function Thumb({ index, state, trackRef, className }: ThumbProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { thumbProps, inputProps, isDragging, isFocused } = useSliderThumb(
    { index, trackRef, inputRef },
    state
  );

  return (
    <div
      {...thumbProps}
      className={className}
      data-dragging={isDragging || undefined}
      data-focused={isFocused || undefined}
    >
      <input {...inputProps} ref={inputRef} />
    </div>
  );
}
