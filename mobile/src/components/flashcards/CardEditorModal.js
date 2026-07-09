import { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';

export default function CardEditorModal({ visible, onConfirm, onClose }) {
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
        <Pressable onPress={() => {}} className="bg-background border-2 border-borders p-6">
          <Text className="text-text text-xs font-bold uppercase tracking-widest mb-4">
            New Card
          </Text>
          <Text className="text-gray text-xs uppercase tracking-widest mb-1">Front</Text>
          <TextInput
            className="border-2 border-borders px-4 py-3 text-text text-sm mb-4"
            placeholder="Front side"
            placeholderTextColor="#989c9a"
            value={front}
            onChangeText={setFront}
            autoFocus
          />
          <Text className="text-gray text-xs uppercase tracking-widest mb-1">Back</Text>
          <TextInput
            className="border-2 border-borders px-4 py-3 text-text text-sm mb-4"
            placeholder="Back side"
            placeholderTextColor="#989c9a"
            value={back}
            onChangeText={setBack}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 border-2 border-borders py-3 items-center"
              onPress={handleClose}
            >
              <Text className="text-gray text-xs font-bold uppercase tracking-widest">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border-2 border-borders py-3 items-center"
              onPress={handleConfirm}
              disabled={busy}
            >
              <Text className="text-text text-xs font-bold uppercase tracking-widest">
                {busy ? 'Saving…' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
