import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function TextField({ label, hint, id, className = "", ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        className={`h-12 rounded-control border border-border bg-white px-4 text-[15px] text-text outline-none transition-colors placeholder:text-text-secondary/70 focus:border-accent ${className}`}
        {...props}
      />
      {hint && <p className="text-[12px] text-text-secondary">{hint}</p>}
    </div>
  );
}
