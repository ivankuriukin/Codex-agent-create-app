import type { Node } from '@react-types/shared';
import { type ReactNode, useRef } from 'react';
import {
  DismissButton,
  useButton,
  useMenu,
  useMenuItem,
  useMenuTrigger,
  useOverlay,
  useOverlayPosition,
} from 'react-aria';
import { Item, useMenuTriggerState, useTreeState } from 'react-stately';

type MenuItemData = {
  id: string;
  label: ReactNode;
  isDisabled?: boolean;
};

type MenuProps = {
  triggerLabel: ReactNode;
  items: MenuItemData[];
  onAction?: (key: string) => void;
  className?: string;
  triggerClassName?: string;
  listClassName?: string;
  itemClassName?: string;
};

export function Menu({
  triggerLabel,
  items,
  onAction,
  className,
  triggerClassName,
  listClassName,
  itemClassName,
}: MenuProps) {
  const state = useMenuTriggerState({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, triggerRef);
  const { buttonProps } = useButton(menuTriggerProps, triggerRef);
  const menuState = useTreeState({
    selectionMode: 'none',
    items,
    children: (item) => <Item key={item.id}>{item.label}</Item>,
  });

  return (
    <div className={className}>
      <button {...buttonProps} ref={triggerRef} className={triggerClassName}>
        {triggerLabel}
      </button>
      {state.isOpen ? (
        <MenuPopover state={state} triggerRef={triggerRef}>
          <MenuList
            {...menuProps}
            state={menuState}
            onAction={onAction}
            className={listClassName}
            itemClassName={itemClassName}
          />
        </MenuPopover>
      ) : null}
    </div>
  );
}

type MenuPopoverProps = {
  state: ReturnType<typeof useMenuTriggerState>;
  triggerRef: React.RefObject<Element>;
  children: ReactNode;
};

function MenuPopover({ state, triggerRef, children }: MenuPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(
    { isOpen: state.isOpen, onClose: state.close, isDismissable: true },
    ref,
  );
  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: ref,
    placement: 'bottom start',
    offset: 8,
    isOpen: state.isOpen,
  });

  return (
    <div {...overlayProps} {...positionProps} ref={ref}>
      <DismissButton onDismiss={state.close} />
      {children}
      <DismissButton onDismiss={state.close} />
    </div>
  );
}

type MenuListProps = {
  state: ReturnType<typeof useTreeState>;
  onAction?: (key: string) => void;
  className?: string;
  itemClassName?: string;
} & Parameters<typeof useMenu>[0];

function MenuList({
  state,
  onAction,
  className,
  itemClassName,
  ...props
}: MenuListProps) {
  const ref = useRef<HTMLUListElement>(null);
  const { menuProps } = useMenu(props, state, ref);

  return (
    <ul {...menuProps} ref={ref} className={className}>
      {[...state.collection].map((item) => (
        <MenuItem
          key={item.key}
          item={item}
          onAction={onAction}
          className={itemClassName}
        />
      ))}
    </ul>
  );
}

type MenuItemProps = {
  item: Node<MenuItemData>;
  onAction?: (key: string) => void;
  className?: string;
};

function MenuItem({ item, onAction, className }: MenuItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { menuItemProps, isDisabled, isFocused } = useMenuItem(
    {
      key: item.key,
      isDisabled: item.props?.isDisabled,
      onAction: (key) => onAction?.(String(key)),
    },
    ref,
  );

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={className}
      data-focused={isFocused}
      data-disabled={isDisabled}
    >
      {item.rendered}
    </li>
  );
}
