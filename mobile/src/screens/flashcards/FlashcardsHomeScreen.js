import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import NamePromptModal from '../../components/flashcards/NamePromptModal';

export default function FlashcardsHomeScreen({ navigation }) {
  const { folders, loading, addFolder, deleteFolder, addTopic, deleteTopic } = useDecks();
  const [expanded, setExpanded] = useState({});
  const [modal, setModal] = useState(null); // { kind: 'folder' } | { kind: 'topic', folderId }

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
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 16 }}>
        {loading ? (
          <ActivityIndicator color="#1B1717" style={{ marginTop: 40 }} />
        ) : folders.length === 0 ? (
          <Text className="text-gray text-xs uppercase tracking-widest mt-8 text-center">
            No folders yet. Add one below.
          </Text>
        ) : (
          folders.map((folder) => (
            <View key={folder.id} className="mb-2">
              {/* Folder row */}
              <TouchableOpacity
                onPress={() => toggleExpand(folder.id)}
                onLongPress={() => confirmDeleteFolder(folder)}
                className="border-2 border-borders px-4 py-3 flex-row items-center justify-between"
              >
                <Text className="text-text font-bold uppercase tracking-widest text-sm flex-1" numberOfLines={1}>
                  {folder.name}
                </Text>
                <Text className="text-gray text-xs ml-2">{expanded[folder.id] ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {/* Topics */}
              {expanded[folder.id] && (
                <View className="ml-4 mt-1">
                  {folder.topics.map((topic) => (
                    <TouchableOpacity
                      key={topic.id}
                      onPress={() => navigation.navigate('Topic', { topicId: topic.id, name: topic.name })}
                      onLongPress={() => confirmDeleteTopic(topic)}
                      className="border-l-2 border-borders pl-3 py-2 mb-1 flex-row items-center justify-between"
                    >
                      <Text className="text-text text-sm uppercase tracking-wide flex-1" numberOfLines={1}>
                        {topic.name}
                      </Text>
                      <Text className="text-gray text-xs ml-2">{topic.cards?.length ?? 0} cards</Text>
                    </TouchableOpacity>
                  ))}

                  {/* Add topic button */}
                  <TouchableOpacity
                    onPress={() => setModal({ kind: 'topic', folderId: folder.id })}
                    className="border-l-2 border-second-gray pl-3 py-2 mb-1"
                  >
                    <Text className="text-gray text-xs uppercase tracking-widest">+ topic</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}

        {/* Add folder */}
        <TouchableOpacity
          onPress={() => setModal({ kind: 'folder' })}
          className="border-2 border-borders border-dashed px-4 py-3 items-center mt-2"
        >
          <Text className="text-gray text-xs font-bold uppercase tracking-widest">+ folder</Text>
        </TouchableOpacity>
      </ScrollView>

      <NamePromptModal
        visible={!!modal}
        title={modal?.kind === 'folder' ? 'New Folder' : 'New Topic'}
        placeholder={modal?.kind === 'folder' ? 'Folder name' : 'Topic name'}
        onConfirm={handleConfirm}
        onClose={() => setModal(null)}
      />
    </View>
  );
}
