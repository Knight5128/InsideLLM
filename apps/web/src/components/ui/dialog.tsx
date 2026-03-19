import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentPropsWithoutRef } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Dialog(props: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />
}

export function DialogTrigger(props: ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />
}

export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-cyan-950/8 backdrop-blur-md" />
      <DialogPrimitive.Content
        className={cn(
          'glass-panel glass-panel-strong fixed left-1/2 top-1/2 z-50 w-[min(92vw,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 text-slate-700',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-slate-700">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
