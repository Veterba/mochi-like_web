import { ScrollView, Text } from 'react-native';
import GuideMarkdown from '../../components/languages/GuideMarkdown';
import { accentHex } from '../../assets/data';

export default function TopicDetailScreen({ route }) {
  const { topic, language = 'English', accentKey } = route.params;
  const accent = accentHex[accentKey] ?? '#1c1e24';

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
      <Text className="text-gray text-xs uppercase tracking-widest mb-2">grammar · {language}</Text>
      <Text className="text-text text-3xl font-black uppercase tracking-tight mb-6">
        {topic.title}
      </Text>

      {topic.body ? (
        <GuideMarkdown markdown={topic.body} accent={accent} />
      ) : (
        <Text className="text-gray text-sm">Lesson content coming soon.</Text>
      )}
    </ScrollView>
  );
}
