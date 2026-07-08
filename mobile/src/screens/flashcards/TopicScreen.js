import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import CardEditorModal from '../../components/flashcards/CardEditorModal';

export default function TopicScreen({ route, navigation }) {
  const { topicId, name } = route.params;
  const { folders, addCard, deleteCard } = useDecks();
  const [showEditor, setShowEditor] = useState(false);

  // Always read live from state
  const topic = folders.flatMap((f) => f.topics).find((t) => t.id === topicId);
  const cards = topic?.cards ?? [];

  const handleAddCard = async (front, back) => {
    await addCard(topicId, front, back);
    setShowEditor(false);
  };

  const confirmDeleteCard = (card) => {
    Alert.alert('Delete card', `Delete "${card.front}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCard(card.id) },
    ]);
  };

  // Data for FlatList: 'add' tile first, then cards
  const data = [{ _add: true }, ...cards];

  const renderItem = ({ item }) => {
    if (item._add) {
      return (
        <TouchableOpacity
          onPress={() => setShowEditor(true)}
          style={{
            flex: 1,
            margin: 4,
            aspectRatio: 1,
            borderWidth: 2,
            borderColor: '#989c9a',
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#989c9a', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
            Add card +
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onLongPress={() => confirmDeleteCard(item)}
        style={{
          flex: 1,
          margin: 4,
          aspectRatio: 1,
          borderWidth: 2,
          borderColor: '#1c1e24',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          backgroundColor: '#F9F7F5',
        }}
      >
        <Text style={{ color: '#1B1717', fontSize: 11, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }} numberOfLines={4}>
          {item.front}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={data}
        keyExtractor={(item) => (item._add ? '_add' : item.id)}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#989c9a', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>
              {cards.length} cards
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (cards.length > 0) {
                  navigation.navigate('Shuffle', { topicId, name });
                }
              }}
              style={{
                borderWidth: 2,
                borderColor: cards.length > 0 ? '#1c1e24' : '#D8D5DB',
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{
                color: cards.length > 0 ? '#1B1717' : '#989c9a',
                fontSize: 10,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}>
                Shuffle
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      <CardEditorModal
        visible={showEditor}
        onConfirm={handleAddCard}
        onClose={() => setShowEditor(false)}
      />
    </View>
  );
}
