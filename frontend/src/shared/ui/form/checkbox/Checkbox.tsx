import { useRef } from "react";
import { type AriaCheckboxProps, useCheckbox } from "react-aria";
import { useToggleState } from "react-stately";

type CheckboxProps = AriaCheckboxProps & {
  className?: string;
  indicatorClassName?: string;
};

export function Checkbox({ className, indicatorClassName, children, ...props }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  const state = useToggleState(props);
  const { inputProps } = useCheckbox(props, state, ref);

  return (
    <label className={className} data-disabled={props.isDisabled || undefined}>
      <span className={indicatorClassName} aria-hidden="true" data-selected={state.isSelected}>
        {state.isSelected ? "✓" : null}
      </span>
      <input {...inputProps} ref={ref} />
      {children}
    </label>
  );
}
