import { cn } from '@/lib/utils'

/** Windows 8 style rectangular toggle switch */
export function MetroToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-[0.95rem]">{label}</span>
        {description && (
          <span className="block text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <span className="flex items-center gap-2 pt-0.5">
        <span className="w-14 text-right text-xs text-muted-foreground">
          {checked ? 'Activé' : 'Désactivé'}
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            'relative h-5 w-11 border-2 border-white transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white',
            checked ? 'bg-primary' : 'bg-transparent',
          )}
        >
          <span
            className={cn(
              'absolute top-[-4px] h-6 w-3 bg-white transition-[left] duration-200 motion-reduce:transition-none',
              checked ? 'left-[calc(100%-8px)]' : 'left-[-4px]',
            )}
          />
        </span>
      </span>
    </label>
  )
}
