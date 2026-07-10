import { View, Text, TouchableOpacity } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import useSwipeDeck from '../../hooks/useSwipeDeck';
import { useMarkActiveToday } from '../../hooks/useActivity';
import SwipeCard from '../../components/flashcards/SwipeCard';
import { useTheme } from '../../hooks/useTheme';
import { api } from '../../api/client';

function reportLearned() {
  api('/flashcards/learned', { method: 'POST', body: { count: 1 } }).catch(() => {});
}

export default function ShuffleScreen({ route, navigation }) {
  const { topicId } = route.params;
  const { folders } = useDecks();
  const { theme } = useTheme();

  useMarkActiveToday();

  const topic = folders.flatMap((f) => f.topics).find((t) => t.id === topicId);
  const cards = topic?.cards ?? [];

  const { current, next, buffer, learned, flipped, seq, flip, commit } = useSwipeDeck(cards);

  const commitWithReport = (known) => {
    if (known) reportLearned();
    commit(known);
  };

  if (!current) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 20, marginBottom: 8 }}>
          All cards known
        </Text>
        <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 32, textAlign: 'center' }}>
          {learned.length} learned
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ borderWidth: 2, borderColor: theme.border, paddingHorizontal: 32, paddingVertical: 12 }}
        >
          <Text style={{ color: theme.text, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>Back to topic</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SwipeCard
        key={seq}
        card={current}
        next={next}
        flipped={flipped}
        flip={flip}
        commit={commitWithReport}
        buffer={buffer}
        learned={learned}
        theme={theme}
      />
    </View>
  );
}
