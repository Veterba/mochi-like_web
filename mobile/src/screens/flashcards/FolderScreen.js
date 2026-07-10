import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import NamePromptModal from '../../components/flashcards/NamePromptModal';
import { useTheme } from '../../hooks/useTheme';

export default function FolderScreen({ route, navigation }) {
  const { folderId, name } = route.params;
  const { folders, addTopic, deleteTopic } = useDecks();
  const [modal, setModal] = useState(false);
  const { theme } = useTheme();

  const folder = folders.find((f) => f.id === folderId);
  const topics = folder?.topics ?? [];

  const confirmDeleteTopic = (topic) => {
    Alert.alert('Delete topic', `Delete "${topic.name}" and all its cards?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTopic(topic.id) },
    ]);
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
      {/* Breadcrumb */}
      <View style={breadcrumbStyle}>
        <TouchableOpacity onPress={() => navigation.navigate('FlashcardsHome')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: theme.accent3, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>‹ Flashcards</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.subtext, fontSize: 11, marginHorizontal: 6 }}>›</Text>
        <Text style={{ color: theme.text, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, flex: 1 }} numberOfLines={1}>
          {name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {topics.length === 0 && (
          <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginTop: 32, textAlign: 'center' }}>
            No topics yet. Add one below.
          </Text>
        )}

        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            onPress={() => navigation.navigate('Topic', { topicId: topic.id, name: topic.name, folderName: name, folderId })}
            onLongPress={() => confirmDeleteTopic(topic)}
            style={{
              borderWidth: 2,
              borderColor: theme.border,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontSize: 13, flex: 1 }} numberOfLines={1}>
              {topic.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: theme.subtext, fontSize: 11 }}>
                {topic.cards?.length ?? 0} cards
              </Text>
              <Text style={{ color: theme.subtext, fontSize: 16 }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => setModal(true)}
          style={{
            borderWidth: 2,
            borderColor: theme.border,
            borderStyle: 'dashed',
            paddingHorizontal: 16,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ color: theme.subtext, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
            + New Topic
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <NamePromptModal
        visible={modal}
        title="New Topic"
        placeholder="Topic name"
        onConfirm={async (topicName) => { await addTopic(folderId, topicName); setModal(false); }}
        onClose={() => setModal(false)}
        theme={theme}
      />
    </View>
  );
}
