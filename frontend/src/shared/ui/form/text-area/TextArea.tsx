import { useRef } from 'react';
import { type AriaTextFieldOptions, useTextField } from 'react-aria';

type TextAreaProps = AriaTextFieldOptions<'textarea'> & {
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  description?: string;
  errorMessage?: string;
};

export function TextArea({
  className,
  labelClassName,
  inputClassName,
  descriptionClassName,
  errorClassName,
  description,
  errorMessage,
  ...props
}: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField<'textarea'>(
      {
        ...props,
        description,
        errorMessage,
        inputElementType: 'textarea',
      },
      ref,
    );

  return (
    <div className={className}>
      {props.label && (
        <label {...labelProps} className={labelClassName}>
          {props.label}
        </label>
      )}
      <textarea {...inputProps} ref={ref} className={inputClassName} />
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
