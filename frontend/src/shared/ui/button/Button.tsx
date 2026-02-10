import { useObjectRef } from '@react-aria/utils';
import { forwardRef,type ReactElement, type ReactNode, type Ref } from 'react';
import {
  type AriaButtonProps,
  mergeProps,
  useButton,
  useFocusRing,
  useHover,
} from 'react-aria';

type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'text'
  | 'link';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type BaseButtonProps = {
  className?: string;
  icon?: ReactNode;
  iconPlacement?: 'start' | 'end';
  loading?: boolean;
  shape?: 'default' | 'circle' | 'round';
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  block?: boolean;
  variant?: ButtonVariant;
  danger?: boolean;
};

type LinkButtonProps = BaseButtonProps &
  AriaButtonProps<'a'> & {
    variant: 'link';
    href: string;
  };

type NonLinkButtonProps = BaseButtonProps &
  AriaButtonProps<'button'> & {
    variant?: Exclude<ButtonVariant, 'link'>;
    href?: never;
  };

type ButtonProps = LinkButtonProps | NonLinkButtonProps;

type ButtonComponent = {
  (
    props: LinkButtonProps & { ref?: Ref<HTMLAnchorElement> },
  ): ReactElement | null;
  (
    props: NonLinkButtonProps & { ref?: Ref<HTMLButtonElement> },
  ): ReactElement | null;
};

const renderContent = (
  startIcon: ReactNode,
  children: ReactNode,
  endIcon: ReactNode,
) => (
  <>
    {startIcon ? <span data-slot="start-icon">{startIcon}</span> : null}
    {children}
    {endIcon ? <span data-slot="end-icon">{endIcon}</span> : null}
  </>
);

type UseButtonSharedParams<
  T extends Element,
  E extends 'a' | 'button',
> = BaseButtonProps & {
  children?: ReactNode;
  restProps: AriaButtonProps<E>;
  elementType: E;
  ref: ReturnType<typeof useObjectRef<T>>;
};

const useButtonShared = <T extends Element, E extends 'a' | 'button'>(
  params: UseButtonSharedParams<T, E>,
) => {
  const {
    className,
    icon,
    iconPlacement = 'start',
    loading,
    shape = 'default',
    size,
    startIcon,
    endIcon,
    block,
    variant,
    danger,
    children,
    restProps,
    elementType,
    ref,
  } = params;
  const resolvedLoading = Boolean(loading);
  const disabled = Boolean(restProps.isDisabled || resolvedLoading);
  const { buttonProps, isPressed } = useButton(
    { ...restProps, isDisabled: disabled, elementType },
    ref,
  );
  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
  const resolvedStartIcon = iconPlacement === 'start' ? icon : startIcon;
  const resolvedEndIcon = iconPlacement === 'end' ? icon : endIcon;
  const sharedProps = {
    ...mergeProps(buttonProps, focusProps, hoverProps),
    ref,
    className,
    'data-pressed': isPressed,
    'data-focus-visible': isFocusVisible,
    'data-hovered': isHovered,
    'data-disabled': disabled,
    'data-loading': resolvedLoading,
    'data-shape': shape,
    'data-size': size,
    'data-block': block,
    'data-variant': variant,
    'data-danger': danger,
    'aria-busy': resolvedLoading,
  };

  return {
    sharedProps,
    content: renderContent(resolvedStartIcon, children, resolvedEndIcon),
  };
};

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      className,
      icon,
      iconPlacement = 'start',
      loading,
      shape = 'default',
      size,
      startIcon,
      endIcon,
      block,
      variant,
      danger,
      href,
      children,
      ...restProps
    },
    ref,
  ) {
    const anchorRef = useObjectRef(ref);
    const { sharedProps, content } = useButtonShared({
      className,
      icon,
      iconPlacement,
      loading,
      shape,
      size,
      startIcon,
      endIcon,
      block,
      variant,
      danger,
      children,
      restProps,
      elementType: 'a',
      ref: anchorRef,
    });

    return (
      <a {...sharedProps} href={href}>
        {content}
      </a>
    );
  },
);

const ButtonBase = forwardRef<HTMLButtonElement, NonLinkButtonProps>(
  function ButtonBase(
    {
      className,
      icon,
      iconPlacement = 'start',
      loading,
      shape = 'default',
      size,
      startIcon,
      endIcon,
      block,
      variant = 'default',
      danger,
      children,
      ...restProps
    },
    ref,
  ) {
    const buttonRef = useObjectRef(ref);
    const { sharedProps, content } = useButtonShared({
      className,
      icon,
      iconPlacement,
      loading,
      shape,
      size,
      startIcon,
      endIcon,
      block,
      variant,
      danger,
      children,
      restProps,
      elementType: 'button',
      ref: buttonRef,
    });

    return <button {...sharedProps}>{content}</button>;
  },
);

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  if (props.variant === 'link') {
    return <LinkButton {...props} ref={ref as Ref<HTMLAnchorElement>} />;
  }

  return <ButtonBase {...props} ref={ref as Ref<HTMLButtonElement>} />;
}) as ButtonComponent;
