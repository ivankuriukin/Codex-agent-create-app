import {
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  useRef,
} from 'react';
import {
  OverlayContainer,
  useOverlayPosition,
  useTooltip,
  useTooltipTrigger,
} from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';

type TooltipProps = {
  children: ReactNode;
  className?: string;
  tooltipProps?: HTMLAttributes<HTMLDivElement>;
};

export function Tooltip({ children, className, tooltipProps }: TooltipProps) {
  return (
    <div {...tooltipProps} className={className}>
      {children}
    </div>
  );
}

type TooltipTriggerProps = {
  children: ReactNode;
  tooltip: ReactNode;
  className?: string;
  tooltipClassName?: string;
};

export function TooltipTrigger({
  children,
  tooltip,
  className,
  tooltipClassName,
}: TooltipTriggerProps) {
  const state = useTooltipTriggerState({ delay: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { triggerProps, tooltipProps } = useTooltipTrigger(
    {},
    state,
    triggerRef,
  );
  const { tooltipProps: ariaTooltipProps } = useTooltip({}, state);
  const { overlayProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'top',
    offset: 8,
    isOpen: state.isOpen,
  });

  return (
    <span className={className}>
      <span {...triggerProps} ref={triggerRef as RefObject<HTMLSpanElement>}>
        {children}
      </span>
      {state.isOpen ? (
        <OverlayContainer>
          <div
            {...overlayProps}
            {...tooltipProps}
            {...ariaTooltipProps}
            ref={overlayRef}
            className={tooltipClassName}
          >
            <Tooltip>{tooltip}</Tooltip>
          </div>
        </OverlayContainer>
      ) : null}
    </span>
  );
}
