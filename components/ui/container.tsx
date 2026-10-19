import type { ElementType, ReactNode } from "react";

/** Centered, responsive page container with consistent gutters. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={`sg-container ${className}`}>{children}</Tag>;
}
