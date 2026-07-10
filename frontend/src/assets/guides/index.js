import en from './en.md?raw'
import no from './no.md?raw'
import de from './de.md?raw'
import es from './es.md?raw'
import fr from './fr.md?raw'
import it from './it.md?raw'
import pt from './pt.md?raw'
import ru from './ru.md?raw'
import uk from './uk.md?raw'
import ja from './ja.md?raw'
import zh from './zh.md?raw'
import ar from './ar.md?raw'

// Splits a guide into topics: every `# Heading <!-- slug: x -->` starts a
// topic; everything until the next `#` is that topic's markdown body.
// Slug comments are stripped — they are stable IDs for future features
// (progress tracking, deep links), not display content.
function parseGuide(md) {
  const topics = []
  let current = null
  for (const line of md.split('\n')) {
    const heading = line.match(/^# (.+?)(?:\s*<!--\s*slug:\s*(\S+)\s*-->)?\s*$/)
    if (heading) {
      current = { title: heading[1].trim(), slug: heading[2] || null, body: [] }
      topics.push(current)
    } else if (current) {
      current.body.push(line)
    }
  }
  return topics.map((t) => ({
    ...t,
    body: t.body.join('\n').replace(/<!--[\s\S]*?-->/g, '').trim(),
  }))
}

// Keyed by the language page slug (see languages in data.js).
export const guides = {
  english: parseGuide(en),
  norwegian: parseGuide(no),
  german: parseGuide(de),
  spanish: parseGuide(es),
  french: parseGuide(fr),
  italian: parseGuide(it),
  portuguese: parseGuide(pt),
  russian: parseGuide(ru),
  ukrainian: parseGuide(uk),
  japanese: parseGuide(ja),
  chinese: parseGuide(zh),
  arabic: parseGuide(ar),
}
