import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { guides } from '../../assets/guides';
import { accentColors, accentHex } from '../../assets/data';
import { useMarkActiveToday } from '../../hooks/useActivity';
import { useTheme } from '../../hooks/useTheme';

export default function LanguageTopicsScreen({ route, navigation }) {
  const { slug, name } = route.params;
  const topics = guides[slug] ?? [];
  const { theme } = useTheme();

  useMarkActiveToday();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
        <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, paddingHorizontal: 24 }}>
          {topics.length} topics · grammar guide
        </Text>

        <View style={{ paddingHorizontal: 24 }}>
          {topics.map((topic, i) => {
            const accentKey = accentColors[i % accentColors.length];
            const color = accentHex[accentKey];
            return (
              <TouchableOpacity
                key={topic.slug || topic.title}
                onPress={() => navigation.navigate('TopicDetail', { topic, language: name, accentKey })}
                style={{
                  borderWidth: 2,
                  borderColor: color,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  marginBottom: 8,
                  gap: 8,
                }}
              >
                <Text style={{ color, fontSize: 11, opacity: 0.7 }}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text
                  style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 1, textAlign: 'center' }}
                  numberOfLines={2}
                >
                  {topic.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
