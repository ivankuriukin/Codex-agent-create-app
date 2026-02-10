import { type ReactNode, type RefObject, useRef } from "react";
import { DismissButton, OverlayContainer, useOverlay, useOverlayPosition } from "react-aria";

type PopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<Element>;
  children: ReactNode;
  className?: string;
  placement?: "bottom" | "top" | "start" | "end" | "bottom start" | "bottom end" | "top start" | "top end";
  offset?: number;
};

export function Popover({
  isOpen,
  onClose,
  triggerRef,
  children,
  className,
  placement = "bottom start",
  offset = 8,
}: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay({ isOpen, onClose, isDismissable: true }, ref);
  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: ref,
    placement,
    offset,
    isOpen,
  });

  if (!isOpen) return null;

  return (
    <OverlayContainer>
      <div {...overlayProps} {...positionProps} ref={ref} className={className}>
        <DismissButton onDismiss={onClose} />
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </OverlayContainer>
  );
}
