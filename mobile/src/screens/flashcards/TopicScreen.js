import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import CardEditorModal from '../../components/flashcards/CardEditorModal';
import { useTheme } from '../../hooks/useTheme';

export default function TopicScreen({ route, navigation }) {
  const { topicId, name } = route.params;
  const { folders, addCard, deleteCard } = useDecks();
  const [showEditor, setShowEditor] = useState(false);
  const { theme } = useTheme();

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

  const data = [{ _add: true }, ...cards];

  const renderItem = ({ item }) => {
    if (item._add) {
      return (
        <TouchableOpacity
          onPress={() => setShowEditor(true)}
          style={{
            flex: 1,
            margin: 4,
            minHeight: 96,
            borderWidth: 2,
            borderColor: theme.subtext,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: theme.subtext, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
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
          minHeight: 96,
          borderWidth: 2,
          borderColor: theme.border,
          backgroundColor: theme.surface,
        }}
      >
        {/* front */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }} numberOfLines={3}>
            {item.front}
          </Text>
        </View>
        {/* back */}
        {item.back ? (
          <View style={{ borderTopWidth: 1, borderTopColor: theme.faint, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ color: theme.subtext, fontSize: 12, textAlign: 'center' }} numberOfLines={2}>
              {item.back}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <FlatList
        data={data}
        keyExtractor={(item) => (item._add ? '_add' : item.id)}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>
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
                borderColor: cards.length > 0 ? theme.border : theme.faint,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{
                color: cards.length > 0 ? theme.text : theme.subtext,
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
        theme={theme}
      />
    </View>
  );
}
