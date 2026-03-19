import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export function Tabs(props: ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />
}

export function TabsList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'glass-chip inline-flex rounded-full p-1 text-sm',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'rounded-full px-4 py-2 text-slate-500 transition data-[state=active]:border data-[state=active]:border-white/80 data-[state=active]:bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(241,245,249,0.78))] data-[state=active]:text-slate-900 data-[state=active]:shadow-[0_8px_20px_rgba(15,23,42,0.08)]',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-4', className)} {...props} />
}
