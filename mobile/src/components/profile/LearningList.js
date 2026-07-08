import { View, Text, TouchableOpacity } from 'react-native';

export default function LearningList({ statuses, onGoToLanguages }) {
  const entries = Object.entries(statuses);
  const learning = entries.filter(([, s]) => s === 'learning');
  const completed = entries.filter(([, s]) => s === 'completed');

  return (
    <View className="border-2 border-borders p-4 mb-4">
      <Text className="text-gray text-xs uppercase tracking-widest mb-3">Learning</Text>

      {entries.length === 0 ? (
        <TouchableOpacity onPress={onGoToLanguages}>
          <Text className="text-gray text-sm">
            Nothing yet. <Text className="text-text underline">Pick a language →</Text>
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="gap-4">
          {learning.length > 0 && (
            <View>
              <Text className="text-accent-1 text-xs uppercase tracking-widest mb-2">
                Currently learning · {learning.length}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {learning.map(([name]) => (
                  <View key={name} className="border border-accent-1 px-3 py-1">
                    <Text className="text-accent-1 text-sm">{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {completed.length > 0 && (
            <View>
              <Text className="text-accent-3 text-xs uppercase tracking-widest mb-2">
                Completed · {completed.length}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {completed.map(([name]) => (
                  <View key={name} className="border border-accent-3 px-3 py-1">
                    <Text className="text-accent-3 text-sm">{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
