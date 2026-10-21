import { useEffect, useState } from 'react'
import { Calculator as CalcIcon, Delete } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Small recursive-descent evaluator: + - * / % ^ and parentheses, no eval() */
export function evaluate(input: string): number | null {
  const src = input
    .replace(/[x×]/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
  let i = 0
  const peek = () => src[i]
  function number(): number {
    if (peek() === '(') {
      i++
      const v = expr()
      if (peek() !== ')') throw new Error('paren')
      i++
      return v
    }
    if (peek() === '-') {
      i++
      return -factor()
    }
    const m = /^\d*\.?\d+/.exec(src.slice(i))
    if (!m) throw new Error('nan')
    i += m[0].length
    return parseFloat(m[0])
  }
  function factor(): number {
    let v = number()
    while (peek() === '%') {
      i++
      v = v / 100
    }
    if (peek() === '^') {
      i++
      v = Math.pow(v, factor())
    }
    return v
  }
  function term(): number {
    let v = factor()
    while (peek() === '*' || peek() === '/') {
      const op = src[i++]
      const r = factor()
      v = op === '*' ? v * r : v / r
    }
    return v
  }
  function expr(): number {
    let v = term()
    while (peek() === '+' || peek() === '-') {
      const op = src[i++]
      const r = term()
      v = op === '+' ? v + r : v - r
    }
    return v
  }
  try {
    const v = expr()
    return i === src.length && Number.isFinite(v) ? v : null
  } catch {
    return null
  }
}

function format(n: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 10 }).format(n)
}

const KEYS = [
  ['C', '(', ')', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['%', '0', ',', '='],
]

export function Calculator({ initial = '' }: { initial?: string }) {
  const startsWithExpr = evaluate(initial) !== null
  const [expr, setExpr] = useState(startsWithExpr ? initial.replace(/\*/g, '×').replace(/\//g, '÷') : '')
  const [result, setResult] = useState<string>(
    startsWithExpr ? format(evaluate(initial) as number) : '0',
  )
  const [done, setDone] = useState(startsWithExpr)

  function press(k: string) {
    if (k === 'C') {
      setExpr('')
      setResult('0')
      setDone(false)
      return
    }
    if (k === '⌫') {
      setExpr((e) => e.slice(0, -1))
      setDone(false)
      return
    }
    if (k === '=') {
      const v = evaluate(expr.replace(/−/g, '-'))
      setResult(v === null ? 'Erreur' : format(v))
      setDone(true)
      return
    }
    // After "=", a digit starts fresh while an operator continues from the result
    if (done) {
      setDone(false)
      const carried = result === 'Erreur' ? '' : result.replace(/[\s\u202f]/g, '')
      setExpr(/[\d,(]/.test(k) ? k : carried + k)
      return
    }
    setExpr((e) => e + k)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      const map: Record<string, string> = {
        '*': '×',
        '/': '÷',
        '-': '−',
        '.': ',',
        Enter: '=',
        Backspace: '⌫',
        Escape: 'C',
      }
      const k = map[e.key] ?? e.key
      if (/^[\d+%(),÷×−=C⌫]$/.test(k)) {
        e.preventDefault()
        press(k)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section
      aria-label="Calculatrice"
      className="nx-turnstile w-full max-w-sm bg-[#1f1f1f] text-white shadow-2xl"
    >
      <header className="flex items-center gap-2 bg-primary px-4 py-2 text-sm">
        <CalcIcon className="size-4" /> Calculatrice
      </header>
      <div className="px-4 pt-4 pb-3 text-right">
        <div className="h-6 truncate text-sm text-muted-foreground" aria-live="polite">
          {expr || ' '}
        </div>
        <output className="metro-light block truncate text-5xl">{result}</output>
      </div>
      <div className="grid grid-cols-4 gap-0.5 p-0.5">
        <button
          type="button"
          onClick={() => press('⌫')}
          aria-label="Effacer le dernier caractère"
          className="col-span-4 flex h-10 items-center justify-end bg-white/5 px-4 hover:bg-white/15"
        >
          <Delete className="size-5" />
        </button>
        {KEYS.flat().map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            className={cn(
              'h-14 text-xl transition-colors active:scale-95',
              k === '='
                ? 'bg-primary hover:brightness-110'
                : /\d|,/.test(k)
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-white/5 hover:bg-white/15',
            )}
          >
            {k}
          </button>
        ))}
      </div>
    </section>
  )
}
