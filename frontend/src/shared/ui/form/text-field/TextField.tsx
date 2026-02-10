import { useRef } from 'react';
import { type AriaTextFieldProps, useTextField } from 'react-aria';

type TextFieldProps = AriaTextFieldProps & {
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  description?: string;
  errorMessage?: string;
};

export function TextField({
  className,
  labelClassName,
  inputClassName,
  descriptionClassName,
  errorClassName,
  description,
  errorMessage,
  ...props
}: TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField({ ...props, description, errorMessage }, ref);

  return (
    <div className={className}>
      {props.label && (
        <label {...labelProps} className={labelClassName}>
          {props.label}
        </label>
      )}
      <input {...inputProps} ref={ref} className={inputClassName} />
      {description && (
        <p {...descriptionProps} className={descriptionClassName}>
          {description}
        </p>
      )}
      {errorMessage && props.isInvalid && (
        <p {...errorMessageProps} className={errorClassName}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
