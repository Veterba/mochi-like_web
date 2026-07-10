import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import NamePromptModal from '../../components/flashcards/NamePromptModal';
import { useTheme } from '../../hooks/useTheme';

export default function FlashcardsHomeScreen({ navigation }) {
  const { folders, loading, addFolder, deleteFolder, addTopic, deleteTopic } = useDecks();
  const [expanded, setExpanded] = useState({});
  const [modal, setModal] = useState(null);
  const { theme } = useTheme();

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleConfirm = async (name) => {
    if (modal?.kind === 'folder') {
      await addFolder(name);
    } else if (modal?.kind === 'topic') {
      await addTopic(modal.folderId, name);
    }
    setModal(null);
  };

  const confirmDeleteFolder = (folder) => {
    Alert.alert('Delete folder', `Delete "${folder.name}" and all its topics?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteFolder(folder.id) },
    ]);
  };

  const confirmDeleteTopic = (topic) => {
    Alert.alert('Delete topic', `Delete "${topic.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTopic(topic.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 16, paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator color={theme.text} style={{ marginTop: 40 }} />
        ) : folders.length === 0 ? (
          <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginTop: 32, textAlign: 'center' }}>
            No folders yet. Add one below.
          </Text>
        ) : (
          folders.map((folder) => (
            <View key={folder.id} style={{ marginBottom: 8 }}>
              {/* Folder row */}
              <TouchableOpacity
                onPress={() => toggleExpand(folder.id)}
                onLongPress={() => confirmDeleteFolder(folder)}
                style={{ borderWidth: 2, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, flex: 1 }} numberOfLines={1}>
                  {folder.name}
                </Text>
                <Text style={{ color: theme.subtext, fontSize: 12, marginLeft: 8 }}>
                  {expanded[folder.id] ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {/* Topics */}
              {expanded[folder.id] && (
                <View style={{ marginLeft: 16, marginTop: 4 }}>
                  {folder.topics.map((topic) => (
                    <TouchableOpacity
                      key={topic.id}
                      onPress={() => navigation.navigate('Topic', { topicId: topic.id, name: topic.name })}
                      onLongPress={() => confirmDeleteTopic(topic)}
                      style={{ borderLeftWidth: 2, borderLeftColor: theme.border, paddingLeft: 12, paddingVertical: 8, marginBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <Text style={{ color: theme.text, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, flex: 1 }} numberOfLines={1}>
                        {topic.name}
                      </Text>
                      <Text style={{ color: theme.subtext, fontSize: 11, marginLeft: 8 }}>
                        {topic.cards?.length ?? 0} cards
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Add topic button */}
                  <TouchableOpacity
                    onPress={() => setModal({ kind: 'topic', folderId: folder.id })}
                    style={{ borderLeftWidth: 2, borderLeftColor: theme.faint, paddingLeft: 12, paddingVertical: 8, marginBottom: 4 }}
                  >
                    <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>+ topic</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}

        {/* Add folder */}
        <TouchableOpacity
          onPress={() => setModal({ kind: 'folder' })}
          style={{ borderWidth: 2, borderColor: theme.border, borderStyle: 'dashed', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', marginTop: 8 }}
        >
          <Text style={{ color: theme.subtext, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>+ folder</Text>
        </TouchableOpacity>
      </ScrollView>

      <NamePromptModal
        visible={!!modal}
        title={modal?.kind === 'folder' ? 'New Folder' : 'New Topic'}
        placeholder={modal?.kind === 'folder' ? 'Folder name' : 'Topic name'}
        onConfirm={handleConfirm}
        onClose={() => setModal(null)}
        theme={theme}
      />
    </View>
  );
}
