import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDecks } from '../../hooks/useDecks';
import NamePromptModal from '../../components/flashcards/NamePromptModal';
import { useTheme } from '../../hooks/useTheme';

export default function FlashcardsHomeScreen({ navigation }) {
  const { folders, loading, addFolder, deleteFolder } = useDecks();
  const [modal, setModal] = useState(false);
  const { theme } = useTheme();

  const totalCards = (folder) => folder.topics.reduce((sum, t) => sum + (t.cards?.length ?? 0), 0);

  const confirmDeleteFolder = (folder) => {
    Alert.alert('Delete folder', `Delete "${folder.name}" and all its topics?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteFolder(folder.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {loading ? (
          <ActivityIndicator color={theme.text} style={{ marginTop: 40 }} />
        ) : folders.length === 0 ? (
          <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginTop: 32, textAlign: 'center' }}>
            No folders yet. Add one below.
          </Text>
        ) : (
          folders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              onPress={() => navigation.navigate('Folder', { folderId: folder.id, name: folder.name })}
              onLongPress={() => confirmDeleteFolder(folder)}
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
              <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, flex: 1 }} numberOfLines={1}>
                {folder.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: theme.subtext, fontSize: 11 }}>
                  {totalCards(folder)} cards
                </Text>
                <Text style={{ color: theme.subtext, fontSize: 16 }}>›</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

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
            + New Folder
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <NamePromptModal
        visible={modal}
        title="New Folder"
        placeholder="Folder name"
        onConfirm={async (name) => { await addFolder(name); setModal(false); }}
        onClose={() => setModal(false)}
        theme={theme}
      />
    </View>
  );
}
