import { View, Text } from 'react-native';

// Minimal renderer for the guide markdown subset (see assets/guides/*.js):
// ## sections, paragraphs, "- " lists (one nesting level), pipe tables and
// inline **bold** / *italic* / ~~strike~~. Styled to match the app.

// --- inline ---------------------------------------------------------------

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)/g;

function renderInline(text, baseStyle, theme) {
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
            <Text key={i} style={{ textDecorationLine: 'line-through', color: theme.subtext }}>
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

function TableBlock({ rows, theme }) {
  const [header, ...body] = rows;
  return (
    <View style={{ borderWidth: 2, borderColor: theme.border, marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: theme.border, backgroundColor: theme.elevated }}>
        {header.map((cell, c) => (
          <View key={c} style={{ flex: 1, paddingVertical: 5, paddingHorizontal: 6, borderLeftWidth: c === 0 ? 0 : 1, borderLeftColor: theme.faint }}>
            {renderInline(cell, { color: theme.text, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.3 }, theme)}
          </View>
        ))}
      </View>
      {body.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', borderTopWidth: r === 0 ? 0 : 1, borderTopColor: theme.faint }}>
          {row.map((cell, c) => (
            <View key={c} style={{ flex: 1, paddingVertical: 5, paddingHorizontal: 6, borderLeftWidth: c === 0 ? 0 : 1, borderLeftColor: theme.faint }}>
              {renderInline(cell, { color: theme.text, fontSize: 11, lineHeight: 16 }, theme)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function GuideMarkdown({ markdown, accent, theme }) {
  const blocks = parseBlocks(markdown);

  return (
    <View>
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <View key={i} style={{ borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 10, marginTop: i === 0 ? 0 : 20, marginBottom: 10 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                {block.text}
              </Text>
            </View>
          );
        }
        if (block.type === 'table') {
          return <TableBlock key={i} rows={block.rows} theme={theme} />;
        }
        if (block.type === 'list') {
          return (
            <View key={i} style={{ marginBottom: 14 }}>
              {block.items.map((item, j) => (
                <View key={j} style={{ flexDirection: 'row', marginLeft: item.depth * 16, marginBottom: 6 }}>
                  <Text style={{ color: accent, marginRight: 8, fontSize: 14, lineHeight: 21 }}>—</Text>
                  <View style={{ flex: 1 }}>
                    {renderInline(item.text, { color: theme.text, fontSize: 14, lineHeight: 21 }, theme)}
                  </View>
                </View>
              ))}
            </View>
          );
        }
        return (
          <View key={i} style={{ marginBottom: 14 }}>
            {renderInline(block.text, { color: theme.text, fontSize: 14, lineHeight: 22 }, theme)}
          </View>
        );
      })}
    </View>
  );
}
