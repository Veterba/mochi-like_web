import { useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { dateKey } from '../../hooks/useActivity';

function buildWeeks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay()); // back to Sunday

  const weeks = [];
  const cur = new Date(start);
  while (cur <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(cur <= today ? new Date(cur) : null);
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const CELL = 15;
const GAP = 3;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ActivityHeatmap({ days, theme }) {
  const active = new Set(days);
  const weeks = buildWeeks();
  const scrollRef = useRef(null);

  let lastMonth = -1;
  const labels = weeks.map((week) => {
    const first = week.find(Boolean);
    const m = first ? first.getMonth() : lastMonth;
    if (m !== lastMonth) {
      lastMonth = m;
      return MONTHS[m];
    }
    return '';
  });

  return (
    <View style={{ borderWidth: 2, borderColor: theme.border, padding: 16, marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>Activity</Text>
        <Text style={{ color: theme.subtext, fontSize: 10 }}>
          Total active days:{' '}
          <Text style={{ color: theme.text }}>{active.size}</Text>
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View>
          {/* Month labels */}
          <View style={{ flexDirection: 'row', gap: GAP, marginBottom: 5 }}>
            {labels.map((label, i) => (
              <View key={i} style={{ width: CELL }}>
                {label ? (
                  <Text style={{ fontSize: 9, color: theme.subtext, width: 40 }} numberOfLines={1}>
                    {label}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          {/* Grid */}
          <View style={{ flexDirection: 'row', gap: GAP }}>
            {weeks.map((week, wi) => (
              <View key={wi} style={{ flexDirection: 'column', gap: GAP }}>
                {week.map((day, di) =>
                  day ? (
                    <View
                      key={di}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        backgroundColor: active.has(dateKey(day)) ? '#4F6815' : theme.faint,
                      }}
                    />
                  ) : (
                    <View key={di} style={{ width: CELL, height: CELL }} />
                  )
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
