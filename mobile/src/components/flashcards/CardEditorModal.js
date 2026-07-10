import { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';

export default function CardEditorModal({ visible, onConfirm, onClose, theme }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (!front.trim() || busy) return;
    setBusy(true);
    try {
      await onConfirm(front.trim(), back.trim());
      setFront('');
      setBack('');
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setFront('');
    setBack('');
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
            New Card
          </Text>
          <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Front</Text>
          <TextInput
            style={{ borderWidth: 2, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 12, color: theme.text, fontSize: 13, marginBottom: 16, backgroundColor: theme.bg }}
            placeholder="Front side"
            placeholderTextColor={theme.subtext}
            value={front}
            onChangeText={setFront}
            autoFocus
          />
          <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Back</Text>
          <TextInput
            style={{ borderWidth: 2, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 12, color: theme.text, fontSize: 13, marginBottom: 16, backgroundColor: theme.bg }}
            placeholder="Back side"
            placeholderTextColor={theme.subtext}
            value={back}
            onChangeText={setBack}
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
                {busy ? 'Saving…' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
