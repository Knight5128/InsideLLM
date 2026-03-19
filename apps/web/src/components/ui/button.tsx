import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-violet-500 text-white hover:bg-violet-400',
        secondary: 'bg-white/10 text-slate-100 ring-1 ring-white/15 hover:bg-white/15',
        ghost: 'bg-transparent text-slate-300 hover:bg-white/5',
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
