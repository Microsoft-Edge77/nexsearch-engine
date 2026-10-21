import { cn } from '@/lib/utils'

/** The NexSearch window: two white and two grey panes */
export function NexLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={cn('size-8 shrink-0', className)}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="20.5" height="20.5" fill="#ffffff" />
      <rect x="23.5" y="0" width="20.5" height="20.5" fill="#8a8a8a" />
      <rect x="0" y="23.5" width="20.5" height="20.5" fill="#8a8a8a" />
      <rect x="23.5" y="23.5" width="20.5" height="20.5" fill="#ffffff" />
    </svg>
  )
}
