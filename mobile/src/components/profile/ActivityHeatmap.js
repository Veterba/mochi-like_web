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

const CELL = 10;
const GAP = 2;

export default function ActivityHeatmap({ days }) {
  const active = new Set(days);
  const weeks = buildWeeks();
  const scrollRef = useRef(null);

  return (
    <View className="border-2 border-borders p-4 mb-4">
      <View className="flex-row justify-between items-baseline mb-3">
        <Text className="text-gray text-xs uppercase tracking-widest">Activity</Text>
        <Text className="text-gray text-xs">
          Total active days:{' '}
          <Text className="text-text">{active.size}</Text>
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
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
                      backgroundColor: active.has(dateKey(day)) ? '#4F6815' : '#D8D5DB',
                    }}
                  />
                ) : (
                  <View key={di} style={{ width: CELL, height: CELL }} />
                )
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
