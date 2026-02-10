import { type ReactNode, useRef } from "react";
import {
  DismissButton,
  FocusScope,
  OverlayContainer,
  useDialog,
  useModalOverlay,
} from "react-aria";
import { type OverlayTriggerState } from "react-stately";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  overlayClassName,
  contentClassName,
  titleClassName,
}: ModalProps) {
  if (!isOpen) return null;

  const ref = useRef<HTMLDivElement>(null);
  const state = { isOpen, close: onClose } as OverlayTriggerState;
  const { overlayProps, underlayProps } = useModalOverlay({ isOpen, onClose, isDismissable: true }, state, ref);
  const { dialogProps, titleProps } = useDialog({ role: "dialog" }, ref);

  return (
    <OverlayContainer>
      <div {...underlayProps} className={overlayClassName}>
        <FocusScope contain restoreFocus autoFocus>
          <div {...overlayProps} {...dialogProps} ref={ref} className={contentClassName}>
            <DismissButton onDismiss={onClose} />
            {title ? (
              <h2 {...titleProps} className={titleClassName}>
                {title}
              </h2>
            ) : null}
            {children}
            <DismissButton onDismiss={onClose} />
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  );
}
