import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Prevents unnecessary Tailwind classes and merge classes to prevent class duplication.
 * @param inputs - Any number of class names or class name arrays to merge.
 * @returns A string of merged class names.
 */
export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(...inputs))
  }
