import { createContext, type ReactNode, useContext, useRef } from 'react';
import {
  type AriaRadioGroupProps,
  type AriaRadioProps,
  useRadio,
  useRadioGroup,
} from 'react-aria';
import { useRadioGroupState } from 'react-stately';

const RadioGroupContext = createContext<ReturnType<
  typeof useRadioGroupState
> | null>(null);

type RadioGroupProps = AriaRadioGroupProps & {
  className?: string;
  labelClassName?: string;
  groupClassName?: string;
  description?: string;
  errorMessage?: string;
  children: ReactNode;
};

export function RadioGroup({
  className,
  labelClassName,
  groupClassName,
  description,
  errorMessage,
  children,
  ...props
}: RadioGroupProps) {
  const state = useRadioGroupState(props);
  const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
    useRadioGroup({ ...props, description, errorMessage }, state);

  return (
    <div className={className}>
      {props.label && (
        <span {...labelProps} className={labelClassName}>
          {props.label}
        </span>
      )}
      <div {...radioGroupProps} className={groupClassName}>
        <RadioGroupContext.Provider value={state}>
          {children}
        </RadioGroupContext.Provider>
      </div>
      {description && <p {...descriptionProps}>{description}</p>}
      {errorMessage && props.isInvalid && (
        <p {...errorMessageProps}>{errorMessage}</p>
      )}
    </div>
  );
}

type RadioProps = AriaRadioProps & {
  className?: string;
  indicatorClassName?: string;
};

export function Radio({
  className,
  indicatorClassName,
  children,
  ...props
}: RadioProps) {
  const state = useContext(RadioGroupContext);
  if (!state) {
    throw new Error('Radio must be used within a RadioGroup');
  }

  const ref = useRef<HTMLInputElement>(null);
  const { inputProps, isSelected, isDisabled } = useRadio(props, state, ref);

  return (
    <label className={className} data-disabled={isDisabled}>
      <span
        className={indicatorClassName}
        data-selected={isSelected}
        aria-hidden="true"
      >
        {isSelected ? '●' : null}
      </span>
      <input {...inputProps} ref={ref} />
      {children}
    </label>
  );
}
