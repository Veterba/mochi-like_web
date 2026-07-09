import { View, Text, TouchableOpacity } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import useSwipeDeck from '../../hooks/useSwipeDeck';
import { useMarkActiveToday } from '../../hooks/useActivity';
import SwipeCard from '../../components/flashcards/SwipeCard';

export default function ShuffleScreen({ route, navigation }) {
  const { topicId } = route.params;
  const { folders } = useDecks();

  useMarkActiveToday();

  const topic = folders.flatMap((f) => f.topics).find((t) => t.id === topicId);
  const cards = topic?.cards ?? [];

  const { current, next, buffer, learned, flipped, seq, flip, commit } = useSwipeDeck(cards);

  if (!current) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-text font-bold uppercase tracking-widest text-xl mb-2">All cards known</Text>
        <Text className="text-gray text-xs uppercase tracking-widest mb-8 text-center">
          {learned.length} learned
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="border-2 border-borders px-8 py-3"
        >
          <Text className="text-text text-sm font-bold uppercase tracking-widest">Back to topic</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* key={seq} remounts after every committed swipe so the incoming card
          always starts centered (see note in SwipeCard). */}
      <SwipeCard
        key={seq}
        card={current}
        next={next}
        flipped={flipped}
        flip={flip}
        commit={commit}
        buffer={buffer}
        learned={learned}
      />
    </View>
  );
}
