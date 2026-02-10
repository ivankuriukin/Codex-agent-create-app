import { createCalendar } from '@internationalized/date';
import { type ReactNode, type RefObject, useRef } from 'react';
import {
  DismissButton,
  FocusScope,
  useButton,
  useDateField,
  useDatePicker,
  useDateSegment,
  useDialog,
  useLocale,
  useOverlay,
  useOverlayPosition,
} from 'react-aria';
import { useDateFieldState, useDatePickerState } from 'react-stately';

import { Calendar } from '../calendar';

type DatePickerProps = {
  label?: ReactNode;
  locale?: string;
  className?: string;
  fieldClassName?: string;
  segmentClassName?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  dialogClassName?: string;
} & Parameters<typeof useDatePickerState>[0];

export function DatePicker({
  label,
  className,
  fieldClassName,
  segmentClassName,
  buttonClassName,
  popoverClassName,
  dialogClassName,
  ...props
}: DatePickerProps) {
  const { locale: localeFromContext } = useLocale();
  const { locale: localeProp, ...restProps } = props;
  const locale = localeProp ?? localeFromContext ?? 'en-US';
  const state = useDatePickerState({ ...restProps });
  const ref = useRef<HTMLDivElement>(null);
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker({ ...restProps, label }, state, ref);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { buttonProps: triggerProps } = useButton(buttonProps, buttonRef);

  return (
    <div className={className}>
      {label ? <span {...labelProps}>{label}</span> : null}
      <div {...groupProps} ref={ref}>
        <DateField
          {...fieldProps}
          createCalendar={createCalendar}
          locale={locale}
          className={fieldClassName}
          segmentClassName={segmentClassName}
        />
        <button
          {...triggerProps}
          ref={buttonRef}
          className={buttonClassName}
          type="button"
        >
          ▼
        </button>
      </div>
      {state.isOpen ? (
        <Popover triggerRef={ref} state={state} className={popoverClassName}>
          <Dialog {...dialogProps} className={dialogClassName}>
            <Calendar {...calendarProps} />
          </Dialog>
        </Popover>
      ) : null}
    </div>
  );
}

type DateFieldProps = Parameters<typeof useDateFieldState>[0] & {
  locale?: string;
  createCalendar: typeof createCalendar;
  className?: string;
  segmentClassName?: string;
};

function DateField({ className, segmentClassName, ...props }: DateFieldProps) {
  const state = useDateFieldState(props);
  const ref = useRef<HTMLDivElement>(null);
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div {...fieldProps} ref={ref} className={className}>
      {state.segments.map((segment, index) => (
        <DateSegment
          key={index}
          segment={segment}
          state={state}
          className={segmentClassName}
        />
      ))}
    </div>
  );
}

type DateSegmentProps = {
  segment: ReturnType<typeof useDateFieldState>['segments'][number];
  state: ReturnType<typeof useDateFieldState>;
  className?: string;
};

function DateSegment({ segment, state, className }: DateSegmentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <span {...segmentProps} ref={ref} className={className}>
      {segment.text}
    </span>
  );
}

type PopoverProps = {
  triggerRef: RefObject<Element | null>;
  state: ReturnType<typeof useDatePickerState>;
  children: ReactNode;
  className?: string;
};

function Popover({ triggerRef, state, children, className }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      isDismissable: true,
    },
    ref,
  );
  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef as RefObject<Element>,
    overlayRef: ref,
    placement: 'bottom start',
    offset: 8,
    isOpen: state.isOpen,
  });

  return (
    <FocusScope contain restoreFocus>
      <div {...overlayProps} {...positionProps} ref={ref} className={className}>
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </FocusScope>
  );
}

type DialogProps = {
  children: ReactNode;
  className?: string;
} & Parameters<typeof useDialog>[0];

function Dialog({ children, className, ...props }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { dialogProps } = useDialog(props, ref);

  return (
    <div {...dialogProps} ref={ref} className={className}>
      {children}
    </div>
  );
}
