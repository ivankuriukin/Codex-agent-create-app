import { useRef } from "react";
import { type AriaSwitchProps, useSwitch } from "react-aria";
import { useToggleState } from "react-stately";

type SwitchProps = AriaSwitchProps & {
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
};

export function Switch({ className, trackClassName, thumbClassName, children, ...props }: SwitchProps) {
  const ref = useRef<HTMLInputElement>(null);
  const state = useToggleState(props);
  const { inputProps } = useSwitch(props, state, ref);

  return (
    <label className={className} data-disabled={props.isDisabled || undefined}>
      <span className={trackClassName} data-selected={state.isSelected}>
        <span className={thumbClassName} data-selected={state.isSelected} />
      </span>
      <input {...inputProps} ref={ref} />
      {children}
    </label>
  );
}
