import { ScrollView, Text } from 'react-native';
import GuideMarkdown from '../../components/languages/GuideMarkdown';
import { accentHex } from '../../assets/data';
import { useTheme } from '../../hooks/useTheme';

export default function TopicDetailScreen({ route }) {
  const { topic, language = 'English', accentKey } = route.params;
  const accent = accentHex[accentKey] ?? '#1c1e24';
  const { theme } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 24, paddingBottom: 24 }}>
      <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
        grammar · {language}
      </Text>
      <Text style={{ color: theme.text, fontSize: 28, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -0.5, marginBottom: 24 }}>
        {topic.title}
      </Text>

      {topic.body ? (
        <GuideMarkdown markdown={topic.body} accent={accent} theme={theme} />
      ) : (
        <Text style={{ color: theme.subtext, fontSize: 14 }}>Lesson content coming soon.</Text>
      )}
    </ScrollView>
  );
}
