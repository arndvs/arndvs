import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function estimateReadingTime(charCount: number, wordsPerMinute = 200): string {
  const wordCount = Math.round(charCount / 5)
  const minutes = Math.max(Math.ceil(wordCount / wordsPerMinute), 1)
  return `${minutes} min read`
}

