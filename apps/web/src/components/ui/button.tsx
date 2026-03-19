import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(241,245,249,0.7))] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.88)] hover:-translate-y-0.5 hover:border-sky-100 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(239,246,255,0.76))]',
        secondary:
          'border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,250,252,0.58))] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-slate-50/80',
        ghost: 'border border-transparent bg-transparent text-slate-600 hover:border-white/70 hover:bg-white/55',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ className, variant, asChild, ...props }: Props) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant }), className)} {...props} />
}
