import { type ReactNode, useRef } from "react";
import { useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";

type CollapserProps = {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  defaultExpanded?: boolean;
};

export function Collapser({
  title,
  children,
  className,
  triggerClassName,
  panelClassName,
  defaultExpanded,
}: CollapserProps) {
  const state = useDisclosureState({ defaultExpanded });
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, panelProps } = useDisclosure({}, state, ref);

  return (
    <div className={className}>
      <button {...buttonProps} ref={ref} className={triggerClassName}>
        {title}
      </button>
      {state.isExpanded ? (
        <div {...panelProps} className={panelClassName}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
