import { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';

export default function NamePromptModal({ visible, title, placeholder = 'Name', onConfirm, onClose }) {
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
        <Pressable onPress={() => {}} className="bg-background border-2 border-borders p-6">
          <Text className="text-text text-xs font-bold uppercase tracking-widest mb-4">
            {title}
          </Text>
          <TextInput
            className="border-2 border-borders px-4 py-3 text-text text-sm uppercase tracking-wide mb-4"
            placeholder={placeholder}
            placeholderTextColor="#989c9a"
            value={value}
            onChangeText={setValue}
            autoFocus
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
                {busy ? 'Saving…' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
