import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { guides } from '../../assets/guides';
import { accentColors, accentHex } from '../../assets/data';
import { useMarkActiveToday } from '../../hooks/useActivity';

export default function LanguageTopicsScreen({ route, navigation }) {
  const { slug, name } = route.params;
  const topics = guides[slug] ?? [];

  useMarkActiveToday();

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}>
        <Text className="text-gray text-xs uppercase tracking-widest mb-4 px-6">
          {topics.length} topics · grammar guide
        </Text>

        {/* Right-side rail */}
        <View style={{ borderRightWidth: 2, borderRightColor: '#1c1e24' }}>
          {topics.map((topic, i) => {
            const accentKey = accentColors[i % accentColors.length];
            const color = accentHex[accentKey];
            return (
              <View key={topic.slug || topic.title} className="items-end mb-2">
                <TouchableOpacity
                  onPress={() => navigation.navigate('TopicDetail', { topic, language: name, accentKey })}
                  style={{
                    width: '80%',
                    borderWidth: 2,
                    borderColor: color,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingLeft: 24,
                    paddingRight: 12,
                    gap: 8,
                  }}
                >
                  <Text
                    style={{ color: '#1B1717', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 1, textAlign: 'right' }}
                    numberOfLines={2}
                  >
                    {topic.title}
                  </Text>
                  <Text style={{ color, fontSize: 11, opacity: 0.7, minWidth: 20 }}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
