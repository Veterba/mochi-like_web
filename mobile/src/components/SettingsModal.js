import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { LLM_PROVIDERS } from '../assets/llmProviders';

const MODES = ['light', 'auto', 'dark'];

export default function SettingsModal({ onClose }) {
  const { mode, setMode, llm, setLlm } = useSettings();
  const { theme } = useTheme();

  // Local LLM draft state (committed on Save)
  const [provider, setProvider] = useState(llm.provider || 'default');
  const [model, setModel] = useState(llm.model || '');
  const [apiKey, setApiKey] = useState(llm.apiKey || '');

  const preset = LLM_PROVIDERS.find((p) => p.id === provider) ?? LLM_PROVIDERS[0];

  const handleProviderSelect = (id) => {
    setProvider(id);
    const p = LLM_PROVIDERS.find((p) => p.id === id);
    setModel(p?.models[0] ?? '');
    if (id === 'default') setApiKey('');
  };

  const handleSave = () => {
    setLlm({ provider, model, apiKey });
    onClose();
  };

  const segmentActive = (m) => ({
    backgroundColor: mode === m ? theme.text : 'transparent',
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
  });

  const segmentTextColor = (m) => (mode === m ? theme.bg : theme.text);

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <ScrollView
            style={{ backgroundColor: theme.surface, borderWidth: 2, borderColor: theme.border }}
            contentContainerStyle={{ padding: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={{ color: theme.subtext, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>
              Settings
            </Text>

            {/* Appearance */}
            <Text style={{ color: theme.text, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
              Appearance
            </Text>
            <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: theme.border, marginBottom: 24 }}>
              {MODES.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMode(m)}
                  style={[
                    segmentActive(m),
                    i > 0 && { borderLeftWidth: 1, borderLeftColor: theme.border },
                  ]}
                >
                  <Text style={{ color: segmentTextColor(m), fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* AI Provider */}
            <Text style={{ color: theme.text, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
              AI Provider
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 11, marginBottom: 12, lineHeight: 16 }}>
              Use your own API key, or leave Default to use the app's.
            </Text>

            {/* Provider chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {LLM_PROVIDERS.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => handleProviderSelect(p.id)}
                  style={{
                    borderWidth: 2,
                    borderColor: provider === p.id ? theme.text : theme.faint,
                    backgroundColor: provider === p.id ? theme.text : 'transparent',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: provider === p.id ? theme.bg : theme.subtext, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Model chips (only when not default) */}
            {provider !== 'default' && preset.models.length > 0 && (
              <>
                <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Model
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  {preset.models.map((m) => (
                    <TouchableOpacity
                      key={m}
                      onPress={() => setModel(m)}
                      style={{
                        borderWidth: 1,
                        borderColor: model === m ? theme.text : theme.faint,
                        backgroundColor: model === m ? theme.elevated : 'transparent',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginRight: 6,
                      }}
                    >
                      <Text style={{ color: model === m ? theme.text : theme.subtext, fontSize: 10 }}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* API key (only when not default) */}
            {provider !== 'default' && (
              <>
                <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                  API Key
                </Text>
                <TextInput
                  value={apiKey}
                  onChangeText={setApiKey}
                  placeholder="sk-…"
                  placeholderTextColor={theme.subtext}
                  secureTextEntry
                  style={{
                    borderWidth: 2,
                    borderColor: theme.border,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: theme.text,
                    fontSize: 13,
                    backgroundColor: theme.bg,
                    marginBottom: 16,
                  }}
                />
              </>
            )}

            {/* Save / Cancel */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <TouchableOpacity
                onPress={handleSave}
                style={{ flex: 1, borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ color: theme.text, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Save
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                style={{ flex: 1, borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ color: theme.subtext, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
