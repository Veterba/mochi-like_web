import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
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

function ChatChip({ chat, active, onPress, onLongPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        borderWidth: 2,
        borderColor: active ? theme.border : theme.faint,
        backgroundColor: active ? theme.text : 'transparent',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
      }}
    >
      <Text
        style={{
          color: active ? theme.bg : theme.text,
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

function MessageBubble({ message, theme }) {
  const isUser = message.role === 'user';
  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        borderWidth: 2,
        borderColor: isUser ? theme.border : theme.faint,
        backgroundColor: isUser ? theme.surface : theme.elevated,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: theme.text, fontSize: 14, lineHeight: 21 }}>{message.content}</Text>
    </View>
  );
}

function TutorInner() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const {
    chats, activeChatId, setActiveChatId,
    messages, sending, error,
    newChat, deleteChat, sendMessage,
  } = useTutor();
  const [draft, setDraft] = useState('');
  const [kbHeight, setKbHeight] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      setKbHeight(e.endCoordinates.height);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => setKbHeight(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

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
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24 }}>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 12 }}>
          TUTOR
        </Text>

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
              borderColor: theme.border,
              borderStyle: 'dashed',
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginRight: 8,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
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
              theme={theme}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1, marginBottom: kbHeight }}>
        {activeChatId ? (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => String(m.id)}
            renderItem={({ item }) => <MessageBubble message={item} theme={theme} />}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8, flexGrow: 1 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }}>
                  Ask anything — grammar, words,{'\n'}or just practice a conversation
                </Text>
              </View>
            }
            ListFooterComponent={
              sending ? (
                <View style={{ alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 }}>
                  <ActivityIndicator size="small" color={theme.subtext} />
                </View>
              ) : null
            }
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24, textAlign: 'center' }}>
              Your AI tutor. Start a chat to ask{'\n'}questions and practice.
            </Text>
            <TouchableOpacity
              onPress={newChat}
              style={{ borderWidth: 2, borderColor: theme.border, paddingHorizontal: 32, paddingVertical: 12 }}
            >
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>Start a chat</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input bar */}
        {activeChatId ? (
          <View style={{ paddingHorizontal: 24, paddingBottom: kbHeight > 0 ? 10 : tabBarHeight }}>
            {error ? (
              <Text style={{ color: '#A31E21', fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>{error}</Text>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: theme.border,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: theme.text,
                  fontSize: 14,
                  maxHeight: 100,
                  backgroundColor: theme.bg,
                }}
                placeholder="Message the tutor…"
                placeholderTextColor={theme.subtext}
                value={draft}
                onChangeText={setDraft}
                multiline
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={sending || !draft.trim()}
                style={{
                  borderWidth: 2,
                  borderColor: theme.border,
                  backgroundColor: sending || !draft.trim() ? 'transparent' : theme.text,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: sending || !draft.trim() ? theme.subtext : theme.bg, fontWeight: 'bold', fontSize: 14 }}>
                  ↑
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
