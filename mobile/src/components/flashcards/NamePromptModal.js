import { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';

export default function NamePromptModal({ visible, title, placeholder = 'Name', onConfirm, onClose, theme }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (!value.trim() || busy) return;
    setBusy(true);
    try {
      await onConfirm(value.trim());
      setValue('');
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setValue('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}
        onPress={handleClose}
      >
        <Pressable onPress={() => {}} style={{ backgroundColor: theme.surface, borderWidth: 2, borderColor: theme.border, padding: 24 }}>
          <Text style={{ color: theme.text, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            {title}
          </Text>
          <TextInput
            style={{ borderWidth: 2, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 12, color: theme.text, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, backgroundColor: theme.bg }}
            placeholder={placeholder}
            placeholderTextColor={theme.subtext}
            value={value}
            onChangeText={setValue}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{ flex: 1, borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              onPress={handleClose}
            >
              <Text style={{ color: theme.subtext, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              onPress={handleConfirm}
              disabled={busy}
            >
              <Text style={{ color: theme.text, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                {busy ? 'Saving…' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
