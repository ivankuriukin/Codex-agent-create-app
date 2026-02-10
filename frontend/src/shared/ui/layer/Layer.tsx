import { type ReactNode } from 'react';

type LayerProps = {
  children?: ReactNode;
  className?: string;
};

export function Header({ children, className }: LayerProps) {
  return <header className={className}>{children}</header>;
}

export function Footer({ children, className }: LayerProps) {
  return <footer className={className}>{children}</footer>;
}

export function Main({ children, className }: LayerProps) {
  return <main className={className}>{children}</main>;
}

export function Slider({ children, className }: LayerProps) {
  return <aside className={className}>{children}</aside>;
}
