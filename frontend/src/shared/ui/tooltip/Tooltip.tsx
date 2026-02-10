import { type ReactNode, type RefObject, useRef } from "react";
import {
  OverlayContainer,
  useOverlayPosition,
  useTooltip,
  useTooltipTrigger,
} from "react-aria";
import { useTooltipTriggerState } from "react-stately";

type TooltipProps = {
  children: ReactNode;
  className?: string;
};

export function Tooltip({ children, className }: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { tooltipProps } = useTooltip({}, ref);

  return (
    <div {...tooltipProps} ref={ref} className={className}>
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

export function TooltipTrigger({ children, tooltip, className, tooltipClassName }: TooltipTriggerProps) {
  const state = useTooltipTriggerState({ delay: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { triggerProps, tooltipProps } = useTooltipTrigger({}, state, triggerRef);
  const { overlayProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: "top",
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
          <div {...overlayProps} {...tooltipProps} ref={overlayRef} className={tooltipClassName}>
            {tooltip}
          </div>
        </OverlayContainer>
      ) : null}
    </span>
  );
}
