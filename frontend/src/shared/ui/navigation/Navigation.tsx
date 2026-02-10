import { type ReactNode } from "react";

type NavigationItem = {
  id: string;
  label: ReactNode;
  href?: string;
  onClick?: () => void;
};

type NavigationProps = {
  items: NavigationItem[];
  className?: string;
  itemClassName?: string;
};

export function Navigation({ items, className, itemClassName }: NavigationProps) {
  return (
    <nav className={className} aria-label="Navigation">
      <ul>
        {items.map((item) => (
          <li key={item.id} className={itemClassName}>
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <button type="button" onClick={item.onClick}>
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
