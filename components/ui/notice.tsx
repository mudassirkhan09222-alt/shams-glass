import type { ReactNode } from "react";
import { AlertTriangle, Info, Inbox, Settings } from "lucide-react";
import { Container } from "@/components/ui/container";

type Variant = "not-configured" | "error" | "empty" | "info";

const config = {
  "not-configured": {
    Icon: Settings,
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  error: {
    Icon: AlertTriangle,
    tone: "border-red-200 bg-red-50 text-red-800",
  },
  empty: {
    Icon: Inbox,
    tone: "border-hairline bg-canvas text-ink-soft",
  },
  info: {
    Icon: Info,
    tone: "border-glass-200 bg-glass-100 text-corporate",
  },
} as const;

/**
 * Inline notice used to surface setup, error, and empty states to visitors
 * without faking content. Use `contained=false` for full-width section notices.
 */
export function Notice({
  variant = "info",
  title,
  children,
  className = "",
  contained = true,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
  contained?: boolean;
}) {
  const { Icon, tone } = config[variant];
  const body = (
    <div
      role="status"
      className={`flex gap-4 rounded-2xl border p-5 sm:p-6 ${tone} ${className}`}
    >
      <Icon className="h-6 w-6 shrink-0 mt-0.5" aria-hidden />
      <div className="space-y-1.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-sm leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );

  if (!contained) return body;
  return <Container className="py-4">{body}</Container>;
}
