import { View, Text, TouchableOpacity } from 'react-native';

export default function LearningList({ statuses, onGoToLanguages, theme }) {
  const entries = Object.entries(statuses);
  const learning = entries.filter(([, s]) => s === 'learning');
  const completed = entries.filter(([, s]) => s === 'completed');

  return (
    <View style={{ borderWidth: 2, borderColor: theme.border, padding: 16, marginBottom: 16 }}>
      <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Learning</Text>

      {entries.length === 0 ? (
        <TouchableOpacity onPress={onGoToLanguages}>
          <Text style={{ color: theme.subtext, fontSize: 14 }}>
            Nothing yet.{' '}
            <Text style={{ color: theme.text, textDecorationLine: 'underline' }}>Pick a language →</Text>
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ gap: 16 }}>
          {learning.length > 0 && (
            <View>
              <Text style={{ color: '#d29f22', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                Currently learning · {learning.length}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {learning.map(([name]) => (
                  <View key={name} style={{ borderWidth: 1, borderColor: '#d29f22', paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={{ color: '#d29f22', fontSize: 14 }}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {completed.length > 0 && (
            <View>
              <Text style={{ color: '#4F6815', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                Completed · {completed.length}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {completed.map(([name]) => (
                  <View key={name} style={{ borderWidth: 1, borderColor: '#4F6815', paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={{ color: '#4F6815', fontSize: 14 }}>{name}</Text>
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
