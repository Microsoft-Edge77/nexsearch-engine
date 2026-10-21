import { useState } from 'react'
import { ArrowLeftRight, ExternalLink, Languages, Loader2 } from 'lucide-react'

const LANGS = [
  ['fr', 'Français'],
  ['en', 'Anglais'],
  ['es', 'Espagnol'],
  ['de', 'Allemand'],
  ['it', 'Italien'],
  ['pt', 'Portugais'],
  ['nl', 'Néerlandais'],
  ['ja', 'Japonais'],
  ['zh', 'Chinois'],
  ['ar', 'Arabe'],
] as const

export function Translator() {
  const [from, setFrom] = useState('fr')
  const [to, setTo] = useState('en')
  const [text, setText] = useState('')
  const [out, setOut] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function translate() {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      // Public translation memory API (CORS-enabled); Bing Translator is offered as a deep link
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      )
      if (!res.ok) throw new Error()
      const data = (await res.json()) as { responseData?: { translatedText?: string } }
      setOut(data.responseData?.translatedText ?? '')
    } catch {
      setError('La traduction n’a pas pu aboutir. Réessayez ou ouvrez Bing Traducteur.')
    } finally {
      setLoading(false)
    }
  }

  const bingUrl = `https://www.bing.com/translator?from=${from}&to=${to}&text=${encodeURIComponent(text)}`
  const select =
    'h-9 border-2 border-white/30 bg-[#1f1f1f] px-2 text-sm focus:border-primary focus:outline-none'

  return (
    <section
      aria-label="Traducteur"
      className="nx-turnstile w-full bg-[#1f1f1f] text-white shadow-2xl"
    >
      <header className="flex items-center gap-2 bg-primary px-4 py-2 text-sm">
        <Languages className="size-4" /> Traducteur
      </header>
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4">
        <select aria-label="Langue source" value={from} onChange={(e) => setFrom(e.target.value)} className={select}>
          {LANGS.map(([c, n]) => (
            <option key={c} value={c}>{n}</option>
          ))}
        </select>
        <button
          type="button"
          aria-label="Inverser les langues"
          onClick={() => {
            setFrom(to)
            setTo(from)
            setText(out || text)
            setOut(out ? text : '')
          }}
          className="grid size-9 place-items-center hover:bg-white/10"
        >
          <ArrowLeftRight className="size-4" />
        </button>
        <select aria-label="Langue cible" value={to} onChange={(e) => setTo(e.target.value)} className={select}>
          {LANGS.map(([c, n]) => (
            <option key={c} value={c}>{n}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-0.5 p-4 md:grid-cols-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void translate()
          }}
          rows={5}
          placeholder="Saisissez le texte à traduire"
          aria-label="Texte à traduire"
          className="resize-none bg-white p-3 text-black outline-none"
        />
        <div className="min-h-32 bg-white/10 p-3" aria-live="polite">
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : out ? (
            <p className="whitespace-pre-wrap">{out}</p>
          ) : (
            <p className="text-sm text-muted-foreground">La traduction apparaîtra ici.</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={() => void translate()}
          className="h-10 bg-primary px-5 hover:brightness-110"
        >
          Traduire
        </button>
        <a
          href={bingUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 items-center gap-2 border-2 border-white px-4 text-sm hover:bg-white/10"
        >
          Ouvrir dans Bing Traducteur <ExternalLink className="size-4" />
        </a>
      </div>
    </section>
  )
}
