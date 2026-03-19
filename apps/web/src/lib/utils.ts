import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRatio(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00'
}

export function groupBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K,
) {
  return items.reduce<Record<K, T[]>>((acc, item) => {
    const key = getKey(item)
    acc[key] ??= []
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}
