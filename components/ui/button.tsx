import Link from "next/link";
import { type ReactNode, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "corporate" | "outline" | "ghost" | "light" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-700 hover:shadow-[0_18px_36px_-18px_rgba(16,45,80,0.6)]",
  corporate:
    "bg-corporate text-white hover:bg-corporate-600 hover:shadow-[0_18px_36px_-18px_rgba(23,105,170,0.55)]",
  outline:
    "border border-navy/15 bg-white text-navy hover:border-corporate hover:text-corporate",
  ghost: "text-navy hover:text-corporate",
  light:
    "bg-white text-navy hover:bg-glass hover:text-corporate shadow-sm",
  whatsapp:
    "bg-[#1F9A4A] text-white hover:bg-[#17803B] hover:shadow-[0_18px_36px_-18px_rgba(31,154,74,0.6)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base py-3.5",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

/** Brand button. Renders a Next.js `<Link>` when `href` is provided. */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    iconLeft,
    iconRight,
  } = props;

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {iconLeft ? <span className="shrink-0">{iconLeft}</span> : null}
      {children}
      {iconRight ? <span className="shrink-0">{iconRight}</span> : null}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props as ButtonAsLink;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
