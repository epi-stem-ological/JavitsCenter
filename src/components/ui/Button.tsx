"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BrandArrow } from "@/components/brand/BrandArrow";

const button = cva(
  "inline-flex items-center justify-center gap-2 headline font-semibold uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-javits-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      intent: {
        primary:
          "bg-javits-gold text-javits-black hover:bg-[#F5C400] active:translate-y-[1px]",
        inverse:
          "bg-javits-black text-javits-white hover:bg-[#141414] active:translate-y-[1px]",
        outline:
          "bg-transparent border border-javits-black text-javits-black hover:bg-javits-black hover:text-javits-white",
        ghost:
          "bg-transparent text-javits-black hover:bg-javits-black/5",
      },
      size: {
        sm: "h-10 px-4 text-sm rounded-sm",
        md: "h-12 px-6 text-base rounded-sm",
        lg: "h-14 px-8 text-lg rounded-sm",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  }
);

type ButtonBaseProps = VariantProps<typeof button> & {
  withArrow?: boolean;
  href?: string;
  className?: string;
};

type Props = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { intent, size, withArrow, href, className, children, ...props },
  ref
) {
  const classes = cn(button({ intent, size }), className);
  const arrowColor =
    intent === "primary" || intent === "outline" || intent === "ghost" ? "black" : "gold";

  const inner = (
    <>
      <span>{children}</span>
      {withArrow && <BrandArrow color={arrowColor} size={22} className="ml-1" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {inner}
    </button>
  );
});
