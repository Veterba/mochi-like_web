// Copies the language guides from the web frontend into JS modules Metro can
// bundle (Metro has no ?raw imports). Run after editing any guide:
//   node scripts/sync-guides.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = join(here, '../../frontend/src/assets/guides');
const outDir = join(here, '../src/assets/guides');

mkdirSync(outDir, { recursive: true });

for (const lang of ['en', 'no', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'uk', 'ja', 'zh', 'ar']) {
  const md = readFileSync(join(srcDir, `${lang}.md`), 'utf8');
  const body = `// AUTO-GENERATED from frontend/src/assets/guides/${lang}.md — do not edit.\n// Regenerate with: node scripts/sync-guides.mjs\nexport default ${JSON.stringify(md)};\n`;
  writeFileSync(join(outDir, `${lang}.js`), body);
  console.log(`wrote src/assets/guides/${lang}.js (${md.length} chars)`);
}
