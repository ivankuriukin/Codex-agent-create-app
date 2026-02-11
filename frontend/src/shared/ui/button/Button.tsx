import { useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, type ReactElement, type ReactNode, type Ref } from 'react';
import {
  type AriaButtonProps,
  mergeProps,
  useButton,
  useFocusRing,
  useHover,
} from 'react-aria';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'text'
  | 'link';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

type BaseButtonProps = {
  className?: string;
  icon?: ReactNode;
  iconPlacement?: 'start' | 'end';
  loading?: boolean;
  loadingState?: ButtonStatus;
  loadingText?: string;
  successText?: string;
  errorText?: string;
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

const baseClassName =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden bg-surface-base font-button font-medium transition-colors shadow-md';

const sizeClassName: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[14px] [&_[data-slot=start-icon]]:text-[14px] [&_[data-slot=end-icon]]:text-[14px]',
  md: 'h-10 px-4 text-[14px] [&_[data-slot=start-icon]]:text-[16px] [&_[data-slot=end-icon]]:text-[16px]',
  lg: 'h-12 px-5 text-[16px] [&_[data-slot=start-icon]]:text-[18px] [&_[data-slot=end-icon]]:text-[18px]',
  xl: 'h-14 px-6 text-[18px] [&_[data-slot=start-icon]]:text-[20px] [&_[data-slot=end-icon]]:text-[20px]',
  '2xl':
    'h-16 px-7 text-[20px] [&_[data-slot=start-icon]]:text-[24px] [&_[data-slot=end-icon]]:text-[24px]',
};

const shapeClassName: Record<NonNullable<BaseButtonProps['shape']>, string> = {
  default: 'rounded-[8px] after:rounded-[7px]',
  round: 'rounded-full after:rounded-[9999px]',
  circle: 'rounded-full after:rounded-full aspect-square px-0',
};

const circleSizeClassName: Record<ButtonSize, string> = {
  sm: 'w-8',
  md: 'w-10',
  lg: 'w-12',
  xl: 'w-14',
  '2xl': 'w-16',
};

const variantClassName: Record<
  Exclude<ButtonVariant, 'link'>,
  { base: string; hover: string; active: string; disabled: string }
> = {
  default: {
    base: "border border-primary-active bg-gradient-to-br from-primary-hover to-primary-active text-content-onPrimary after:pointer-events-none after:absolute after:inset-0 after:rounded-[7px] after:bg-gradient-to-br after:from-white/20 after:to-transparent after:content-[''] after:p-px after:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] after:[-webkit-mask-composite:xor] after:[mask-composite:exclude]",
    hover: 'hover:from-primary-hover hover:to-primary-active',
    active: 'active:from-primary-active active:to-primary-active',
    disabled: 'bg-state-disabled',
  },
  primary: {
    base: 'bg-surface-base text-primary-base border-gradient',
    hover: 'hover:bg-surface-muted',
    active: 'active:bg-surface-raised',
    disabled: 'bg-state-disabled',
  },
  secondary: {
    base: "border border-secondary-active bg-gradient-to-br from-secondary-hover to-secondary-active text-content-onPrimary after:pointer-events-none after:absolute after:inset-0 after:rounded-[7px] after:border after:border-white/20 after:content-['']",
    hover: 'hover:from-secondary-hover hover:to-secondary-active',
    active: 'active:from-secondary-active active:to-secondary-active',
    disabled: 'bg-state-disabled',
  },
  ghost: {
    base: 'bg-transparent text-primary-base border-transparent',
    hover: 'hover:bg-surface-muted',
    active: 'active:bg-surface-raised',
    disabled: 'text-content-disabled',
  },
  text: {
    base: 'bg-transparent text-primary-base border-transparent shadow-none',
    hover: 'hover:text-primary-hover',
    active: 'active:text-primary-active',
    disabled: 'text-content-disabled',
  },
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

const statusTransition = {
  initial: { x: -24 },
  animate: { x: 0 },
  exit: { x: 24 },
  transition: { duration: 0.25 },
};

const LoadingIndicator = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-2">
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <span>{text}</span>
  </span>
);

const StatusIndicator = ({ text, icon }: { text: string; icon: ReactNode }) => (
  <span className="inline-flex items-center gap-2">
    {icon}
    <span>{text}</span>
  </span>
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
    loadingState,
    loadingText = 'Loading',
    successText = 'Success',
    errorText = 'Error',
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
  const resolvedState: ButtonStatus =
    loadingState ?? (loading ? 'loading' : 'idle');
  const resolvedLoading = resolvedState === 'loading';
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
    className: classNames(className, disabled ? 'pointer-events-none' : null),
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

  const idleContent = renderContent(
    resolvedStartIcon,
    children,
    resolvedEndIcon,
  );
  const content =
    resolvedState === 'idle' ? (
      idleContent
    ) : resolvedState === 'loading' ? (
      <LoadingIndicator text={loadingText} />
    ) : resolvedState === 'success' ? (
      <StatusIndicator
        text={successText}
        icon={<FiCheckCircle aria-hidden="true" />}
      />
    ) : (
      <StatusIndicator
        text={errorText}
        icon={<FiXCircle aria-hidden="true" />}
      />
    );

  return {
    sharedProps,
    content,
    idleContent,
    resolvedState,
  };
};

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      className,
      icon,
      iconPlacement = 'start',
      loading,
      loadingState,
      loadingText,
      successText,
      errorText,
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
    const { sharedProps, content, idleContent, resolvedState } =
      useButtonShared({
        className: classNames('text-blue-600 underline shadow-none', className),
        icon,
        iconPlacement,
        loading,
        loadingState,
        loadingText,
        successText,
        errorText,
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
        <span className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <span className="invisible pointer-events-none inline-flex h-full w-full items-center justify-center gap-2">
            {idleContent}
          </span>
          <AnimatePresence mode="sync" initial={false}>
            <motion.span
              key={resolvedState}
              className="absolute inset-0 inline-flex h-full w-full items-center justify-center gap-2"
              {...statusTransition}
            >
              {content}
            </motion.span>
          </AnimatePresence>
        </span>
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
      loadingState,
      loadingText,
      successText,
      errorText,
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
    const resolvedSize = size ?? 'md';
    const resolvedShape = shape ?? 'default';
    const resolvedVariant = variant ?? 'default';
    const variantStyles = variantClassName[resolvedVariant];
    const resolvedClassName = classNames(
      baseClassName,
      sizeClassName[resolvedSize],
      shapeClassName[resolvedShape],
      resolvedShape === 'circle' ? circleSizeClassName[resolvedSize] : null,
      variantStyles.base,
      variantStyles.hover,
      variantStyles.active,
      block ? 'w-full' : null,
      (restProps.isDisabled || loading) && variantStyles.disabled,
      restProps.isDisabled || loading ? 'cursor-not-allowed' : null,
      loading ? 'cursor-wait' : null,
      className,
    );
    const { sharedProps, content, idleContent, resolvedState } =
      useButtonShared({
        className: resolvedClassName,
        icon,
        iconPlacement,
        loading,
        loadingState,
        loadingText,
        successText,
        errorText,
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

    return (
      <button {...sharedProps}>
        <span className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <span className="invisible pointer-events-none inline-flex h-full w-full items-center justify-center gap-2">
            {idleContent}
          </span>
          <AnimatePresence mode="sync" initial={false}>
            <motion.span
              key={resolvedState}
              className="absolute inset-0 inline-flex h-full w-full items-center justify-center gap-2"
              {...statusTransition}
            >
              {content}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    );
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
