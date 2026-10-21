import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { History, Search } from 'lucide-react'

import { useNex, type SearchTab } from '@/lib/nex-store'
import { cn } from '@/lib/utils'

interface SearchBoxProps {
  defaultValue?: string
  tab?: SearchTab
  size?: 'lg' | 'md'
  autoFocus?: boolean
  className?: string
}

export function SearchBox({
  defaultValue = '',
  tab = 'web',
  size = 'md',
  autoFocus,
  className,
}: SearchBoxProps) {
  const navigate = useNavigate()
  const { history } = useNex()
  const [value, setValue] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const [lastDefault, setLastDefault] = useState(defaultValue)

  // Keep the box in sync when the URL query changes (e.g. history tile clicks)
  if (defaultValue !== lastDefault) {
    setLastDefault(defaultValue)
    setValue(defaultValue)
  }

  const needle = value.trim().toLowerCase()
  const suggestions = history
    .filter((h) => h.q.toLowerCase().includes(needle) && h.q.toLowerCase() !== needle)
    .slice(0, 6)

  function go(q: string) {
    const query = q.trim()
    if (!query) return
    setFocused(false)
    void navigate({ to: '/search', search: { q: query, tab } })
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        go(value)
      }}
      className={cn('relative w-full', className)}
    >
      <div
        className={cn(
          'flex items-stretch border-2 bg-white text-black transition-colors',
          focused ? 'border-primary' : 'border-white/0',
        )}
      >
        <input
          type="search"
          name="q"
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Rechercher sur le web avec NexSearch"
          aria-label="Rechercher"
          className={cn(
            'min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-neutral-500',
            size === 'lg' ? 'h-12 text-lg' : 'h-10 text-base',
          )}
        />
        <button
          type="submit"
          aria-label="Lancer la recherche"
          className={cn(
            'grid place-items-center bg-primary text-white transition-[filter] hover:brightness-110 active:brightness-90',
            size === 'lg' ? 'w-14' : 'w-11',
          )}
        >
          <Search className="size-5" />
        </button>
      </div>
      {focused && suggestions.length > 0 && (
        <ul className="nx-rise absolute inset-x-0 top-full z-40 bg-popover py-1 shadow-2xl">
          {suggestions.map((s) => (
            <li key={s.at}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(s.q)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-white/10"
              >
                <History className="size-4 text-muted-foreground" />
                {s.q}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
