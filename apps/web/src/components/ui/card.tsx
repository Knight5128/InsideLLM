import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}
