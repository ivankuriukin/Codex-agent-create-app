import { type ReactNode, type RefObject, useRef } from "react";
import {
  type AriaListBoxOptions,
  type AriaSelectProps,
  DismissButton,
  mergeProps,
  useButton,
  useFocusRing,
  useListBox,
  useOption,
  useOverlay,
  useOverlayPosition,
  useSelect,
} from "react-aria";
import { Item, useSelectState } from "react-stately";

type SelectItem = {
  id: string;
  label: string;
};

type SelectProps = Omit<AriaSelectProps<SelectItem>, "children"> & {
  items: SelectItem[];
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  listClassName?: string;
  itemClassName?: string;
};

export function Select({
  items,
  className,
  triggerClassName,
  popoverClassName,
  listClassName,
  itemClassName,
  ...props
}: SelectProps) {
  const state = useSelectState({
    ...props,
    items,
    children: (item) => <Item key={item.id}>{item.label}</Item>,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(props, state, triggerRef);
  const { buttonProps } = useButton(triggerProps, triggerRef);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div className={className}>
      {props.label && (
        <label {...labelProps}>
          {props.label}
        </label>
      )}
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={triggerRef}
        className={triggerClassName}
        data-focus-visible={isFocusVisible || undefined}
      >
        <span {...valueProps}>
          {state.selectedItem ? state.selectedItem.rendered : "Select..."}
        </span>
        <span aria-hidden="true">▾</span>
      </button>
      {state.isOpen && (
        <Popover state={state} triggerRef={triggerRef} className={popoverClassName}>
          <ListBox state={state} {...menuProps} className={listClassName} itemClassName={itemClassName} />
        </Popover>
      )}
    </div>
  );
}

type PopoverProps = {
  state: ReturnType<typeof useSelectState>;
  triggerRef: RefObject<Element>;
  children: ReactNode;
  className?: string;
};

function Popover({ state, triggerRef, children, className }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      isDismissable: true,
    },
    ref
  );
  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: ref,
    placement: "bottom start",
    offset: 8,
    isOpen: state.isOpen,
  });

  return (
    <div
      {...mergeProps(overlayProps, positionProps)}
      ref={ref}
      className={className}
    >
      <DismissButton onDismiss={state.close} />
      {children}
      <DismissButton onDismiss={state.close} />
    </div>
  );
}

type ListBoxProps = {
  state: ReturnType<typeof useSelectState>;
  className?: string;
  itemClassName?: string;
} & AriaListBoxOptions<unknown>;

function ListBox({ state, className, itemClassName, ...props }: ListBoxProps) {
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxProps } = useListBox(props, state, ref);

  return (
    <ul {...listBoxProps} ref={ref} className={className}>
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} className={itemClassName} />
      ))}
    </ul>
  );
}

type OptionProps = {
  item: any;
  state: ReturnType<typeof useSelectState>;
  className?: string;
};

function Option({ item, state, className }: OptionProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={className}
      data-focused={isFocused || undefined}
      data-selected={isSelected || undefined}
      data-disabled={isDisabled || undefined}
    >
      {item.rendered}
    </li>
  );
}
