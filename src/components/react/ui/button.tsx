import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg shadow-sm hover:bg-accent-strong shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
        secondary: "border border-line-strong bg-surface text-fg shadow-sm hover:bg-hover",
        ghost: "text-fg-2 hover:bg-hover hover:text-fg",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-9 px-3.5 text-sm",
        lg: "h-11 px-5 text-[15px]",
        icon: "size-8",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
