import { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../hooks/useAuth';
import useTutor from '../hooks/useTutor';
import SignInPrompt from '../components/SignInPrompt';

export default function TutorScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <SignInPrompt
        title="Tutor"
        message="Chat with your AI language tutor — explanations, corrections and practice. Sign in to start."
      />
    );
  }

  return <TutorInner />;
}

function ChatChip({ chat, active, onPress, onLongPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        borderWidth: 2,
        borderColor: active ? '#1c1e24' : '#D8D5DB',
        backgroundColor: active ? '#1B1717' : 'transparent',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
      }}
    >
      <Text
        style={{
          color: active ? '#F9F7F5' : '#1B1717',
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
        numberOfLines={1}
      >
        {chat.title}
      </Text>
    </TouchableOpacity>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        borderWidth: 2,
        borderColor: isUser ? '#1c1e24' : '#D8D5DB',
        backgroundColor: isUser ? '#F9F7F5' : '#EFEDEA',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: '#1B1717', fontSize: 14, lineHeight: 21 }}>{message.content}</Text>
    </View>
  );
}

function TutorInner() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    chats, activeChatId, setActiveChatId,
    messages, sending, error,
    newChat, deleteChat, sendMessage,
  } = useTutor();
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  const handleSend = () => {
    const content = draft.trim();
    if (!content || sending || !activeChatId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraft('');
    sendMessage(content);
  };

  const confirmDeleteChat = (chat) => {
    Alert.alert('Delete chat', `Delete "${chat.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteChat(chat.id) },
    ]);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={tabBarHeight}
    >
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24 }}>
        <Text className="text-3xl font-bold uppercase text-text tracking-widest mb-3">TUTOR</Text>

        {/* Chats strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12, flexGrow: 0 }}
        >
          <TouchableOpacity
            onPress={newChat}
            style={{
              borderWidth: 2,
              borderColor: '#1c1e24',
              borderStyle: 'dashed',
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginRight: 8,
            }}
          >
            <Text style={{ color: '#1B1717', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
              + New
            </Text>
          </TouchableOpacity>
          {chats.map((chat) => (
            <ChatChip
              key={chat.id}
              chat={chat}
              active={chat.id === activeChatId}
              onPress={() => setActiveChatId(chat.id)}
              onLongPress={() => confirmDeleteChat(chat)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      {activeChatId ? (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8, flexGrow: 1 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text className="text-gray text-xs uppercase tracking-widest text-center">
                Ask anything — grammar, words,{'\n'}or just practice a conversation
              </Text>
            </View>
          }
          ListFooterComponent={
            sending ? (
              <View style={{ alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 }}>
                <ActivityIndicator size="small" color="#989c9a" />
              </View>
            ) : null
          }
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Text className="text-gray text-xs uppercase tracking-widest mb-6 text-center">
            Your AI tutor. Start a chat to ask{'\n'}questions and practice.
          </Text>
          <TouchableOpacity onPress={newChat} className="border-2 border-borders px-8 py-3">
            <Text className="text-text text-sm font-bold uppercase tracking-widest">Start a chat</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input bar */}
      {activeChatId ? (
        <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
          {error ? (
            <Text className="text-accent-2 text-xs font-bold mb-2">{error}</Text>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 2,
                borderColor: '#1c1e24',
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: '#1B1717',
                fontSize: 14,
                maxHeight: 100,
              }}
              placeholder="Message the tutor…"
              placeholderTextColor="#989c9a"
              value={draft}
              onChangeText={setDraft}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={sending || !draft.trim()}
              style={{
                borderWidth: 2,
                borderColor: '#1c1e24',
                backgroundColor: sending || !draft.trim() ? 'transparent' : '#1B1717',
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: sending || !draft.trim() ? '#989c9a' : '#F9F7F5', fontWeight: 'bold', fontSize: 14 }}>
                ↑
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}
