import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import CardEditorModal from '../../components/flashcards/CardEditorModal';
import { useTheme } from '../../hooks/useTheme';

export default function TopicScreen({ route, navigation }) {
  const { topicId, name, folderName, folderId } = route.params;
  const { folders, addCard, deleteCard } = useDecks();
  const [showEditor, setShowEditor] = useState(false);
  const [flipped, setFlipped] = useState({});
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

  const toggleFlip = (id) => setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));

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
            + New Card
          </Text>
        </TouchableOpacity>
      );
    }

    const isFlipped = !!flipped[item.id];

    return (
      <TouchableOpacity
        onPress={() => toggleFlip(item.id)}
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          {!isFlipped ? (
            <>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }} numberOfLines={3}>
                {item.front}
              </Text>
              <Text style={{ color: theme.subtext, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
                tap to flip
              </Text>
            </>
          ) : (
            <>
              <Text style={{ color: theme.subtext, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                back
              </Text>
              <Text style={{ color: theme.text, fontSize: 13, textAlign: 'center' }} numberOfLines={4}>
                {item.back || '—'}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const breadcrumbStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: theme.border,
    backgroundColor: theme.bg,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Breadcrumb: Flashcards › FolderName › TopicName */}
      <View style={breadcrumbStyle}>
        <TouchableOpacity onPress={() => navigation.navigate('FlashcardsHome')}>
          <Text style={{ color: theme.accent3, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>Flashcards</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.subtext, fontSize: 11, marginHorizontal: 4 }}>›</Text>
        {folderName && folderId ? (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('Folder', { folderId, name: folderName })}>
              <Text style={{ color: theme.accent3, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                {folderName}
              </Text>
            </TouchableOpacity>
            <Text style={{ color: theme.subtext, fontSize: 11, marginHorizontal: 4 }}>›</Text>
          </>
        ) : null}
        <Text style={{ color: theme.text, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, flex: 1 }} numberOfLines={1}>
          {name}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => (item._add ? '_add' : item.id)}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
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
                Review ›
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
