import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes intelligently.
 *
 * Combines `clsx` (conditional/array/object inputs) with `tailwind-merge`
 * (deduplicates conflicting Tailwind utilities, last wins). This is the
 * shadcn/ui `cn()` pattern. Use it wherever the library composes a
 * user-supplied `className` override with internal base classes, so the
 * override reliably wins regardless of generated CSS order.
 *
 * @example
 * cn("max-w-[640px]", "max-w-[800px]") // => "max-w-[800px]"
 * cn("p-4", condition && "p-6")        // => "p-6" when condition is true
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
