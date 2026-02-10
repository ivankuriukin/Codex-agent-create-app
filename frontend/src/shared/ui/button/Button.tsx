import { useRef } from "react";
import { type AriaButtonProps, mergeProps, useButton, useFocusRing } from "react-aria";

type ButtonProps = AriaButtonProps<"button"> & {
  className?: string;
};

export function Button({ className, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={className}
      data-pressed={isPressed || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={props.isDisabled || undefined}
    >
      {props.children}
    </button>
  );
}
