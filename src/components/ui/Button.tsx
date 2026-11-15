import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "plain" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-accent text-white hover:opacity-90 active:opacity-80",
  outline: "border border-border text-text hover:bg-surface",
  plain: "text-text hover:bg-surface",
  danger: "text-danger hover:bg-danger/5",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
      {...props}
    />
  );
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}>
      {children}
    </Link>
  );
}
