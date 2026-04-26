import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Card — neutral surface for list items, offers, quick actions.
 * Keeps radii and shadows consistent with the brand's clean, modern feel.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white shadow-card border border-line overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}
