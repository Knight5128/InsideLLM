import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'glass-chip inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500',
        className,
      )}
      {...props}
    />
  )
}
