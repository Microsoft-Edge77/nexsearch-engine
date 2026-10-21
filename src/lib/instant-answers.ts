export type InstantTool = 'calculator' | 'translator' | 'timer'

const PATTERNS: [InstantTool, RegExp][] = [
  ['calculator', /\b(calculatrice|calculette|calculator|calcul|calc)\b/i],
  ['translator', /\b(traducteur|traduction|traduire|translate|translator|bing traducteur)\b/i],
  ['timer', /\b(timer|minuteur|minuterie|chronom[eè]tre|compte [àa] rebours|countdown)\b/i],
]

/** A plain arithmetic expression such as "12*(3+4)" also opens the calculator */
const EXPRESSION = /^[\d\s.,+\-*/x×÷()%^]+$/

export function detectTool(q: string): InstantTool | null {
  const query = q.trim()
  for (const [tool, re] of PATTERNS) if (re.test(query)) return tool
  if (EXPRESSION.test(query) && /\d\s*[+\-*/x×÷^%]\s*\d/.test(query)) return 'calculator'
  return null
}

/** Pulls a duration like "5 min", "90 s" or "1h30" out of a timer query */
export function parseDuration(q: string): number | null {
  const h = /(\d+)\s*h/i.exec(q)
  const m = /(\d+)\s*(min|m\b|minutes?)/i.exec(q)
  const s = /(\d+)\s*(s\b|sec|secondes?)/i.exec(q)
  const total =
    (h ? +h[1] * 3600 : 0) + (m ? +m[1] * 60 : 0) + (s ? +s[1] : 0)
  return total > 0 ? total : null
}
