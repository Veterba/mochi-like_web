import { View, Text, ScrollView } from 'react-native';

// Minimal renderer for the guide markdown subset (see assets/guides/*.js):
// ## sections, paragraphs, "- " lists (one nesting level), pipe tables and
// inline **bold** / *italic* / ~~strike~~. Styled to match the app.

const TEXT = '#1B1717';
const GRAY = '#989c9a';
const BORDER = '#1c1e24';

// --- inline ---------------------------------------------------------------

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)/g;

function renderInline(text, baseStyle) {
  const parts = text.split(INLINE).filter(Boolean);
  return (
    <Text style={baseStyle}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={i} style={{ fontWeight: 'bold' }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <Text key={i} style={{ fontStyle: 'italic' }}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        if (part.startsWith('~~') && part.endsWith('~~')) {
          return (
            <Text key={i} style={{ textDecorationLine: 'line-through', color: GRAY }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

// --- block parsing ----------------------------------------------------------

function parseBlocks(md) {
  const blocks = [];
  let paragraph = [];
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ') });
      paragraph = [];
    }
  };

  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const heading = trimmed.match(/^##\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: 'h2', text: heading[1] });
      continue;
    }

    if (trimmed.startsWith('|')) {
      flushParagraph();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        // skip the |---|---| separator row
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      i--;
      blocks.push({ type: 'table', rows });
      continue;
    }

    const item = line.match(/^(\s*)-\s+(.+)$/);
    if (item) {
      flushParagraph();
      const depth = item[1].length >= 2 ? 1 : 0;
      const last = blocks[blocks.length - 1];
      const entry = { text: item[2], depth };
      if (last?.type === 'list') last.items.push(entry);
      else blocks.push({ type: 'list', items: [entry] });
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

// --- blocks -----------------------------------------------------------------

function TableBlock({ rows }) {
  const [header, ...body] = rows;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
      <View style={{ borderWidth: 2, borderColor: BORDER }}>
        <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: BORDER, backgroundColor: '#EFEDEA' }}>
          {header.map((cell, c) => (
            <View key={c} style={{ minWidth: 96, maxWidth: 200, paddingVertical: 6, paddingHorizontal: 8 }}>
              {renderInline(cell, { color: TEXT, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 })}
            </View>
          ))}
        </View>
        {body.map((row, r) => (
          <View key={r} style={{ flexDirection: 'row', borderTopWidth: r === 0 ? 0 : 1, borderTopColor: '#D8D5DB' }}>
            {row.map((cell, c) => (
              <View key={c} style={{ minWidth: 96, maxWidth: 200, paddingVertical: 6, paddingHorizontal: 8 }}>
                {renderInline(cell, { color: TEXT, fontSize: 13, lineHeight: 19 })}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function GuideMarkdown({ markdown, accent = BORDER }) {
  const blocks = parseBlocks(markdown);

  return (
    <View>
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <View key={i} style={{ borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 10, marginTop: i === 0 ? 0 : 20, marginBottom: 10 }}>
              <Text style={{ color: TEXT, fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                {block.text}
              </Text>
            </View>
          );
        }
        if (block.type === 'table') {
          return <TableBlock key={i} rows={block.rows} />;
        }
        if (block.type === 'list') {
          return (
            <View key={i} style={{ marginBottom: 14 }}>
              {block.items.map((item, j) => (
                <View key={j} style={{ flexDirection: 'row', marginLeft: item.depth * 16, marginBottom: 6 }}>
                  <Text style={{ color: accent, marginRight: 8, fontSize: 14, lineHeight: 21 }}>—</Text>
                  <View style={{ flex: 1 }}>
                    {renderInline(item.text, { color: TEXT, fontSize: 14, lineHeight: 21 })}
                  </View>
                </View>
              ))}
            </View>
          );
        }
        return (
          <View key={i} style={{ marginBottom: 14 }}>
            {renderInline(block.text, { color: TEXT, fontSize: 14, lineHeight: 22 })}
          </View>
        );
      })}
    </View>
  );
}
