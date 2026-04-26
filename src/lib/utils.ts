import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Standard class merger — shadcn convention. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Currency formatter used across offers + admin analytics. */
export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
