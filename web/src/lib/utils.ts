import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function cn(...classes: (string | undefined | false)[]) {
//   return classes.filter(Boolean).join(" ");
// }