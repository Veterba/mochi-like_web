import en from './en';
import no from './no';
import de from './de';
import es from './es';

// Splits a guide into topics: every `# Heading <!-- slug: x -->` starts a
// topic; everything until the next `#` is that topic's markdown body.
// Mirrors frontend/src/assets/guides/index.js — keep the two in sync.
function parseGuide(md) {
  const topics = [];
  let current = null;
  for (const line of md.split('\n')) {
    const heading = line.match(/^# (.+?)(?:\s*<!--\s*slug:\s*(\S+)\s*-->)?\s*$/);
    if (heading) {
      current = { title: heading[1].trim(), slug: heading[2] || null, body: [] };
      topics.push(current);
    } else if (current) {
      current.body.push(line);
    }
  }
  return topics.map((t) => ({
    ...t,
    body: t.body.join('\n').replace(/<!--[\s\S]*?-->/g, '').trim(),
  }));
}

// Keyed by the language's lowercase name (see languages in ../data.js).
export const guides = {
  english: parseGuide(en),
  norwegian: parseGuide(no),
  german: parseGuide(de),
  spanish: parseGuide(es),
};
