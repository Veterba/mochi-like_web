import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { accentHex } from '../../assets/data';

export default function LangPopup({ name, accentKey, status, onSetStatus, onRemove, onClose }) {
  const color = accentHex[accentKey] ?? '#1c1e24';

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}} className="bg-background border-2 border-borders p-8">
          {/* Language card preview */}
          <View
            style={{ borderColor: color, borderWidth: 2, aspectRatio: 4 / 3 }}
            className="mb-6 items-center justify-center"
          >
            <Text className="text-text text-2xl font-bold uppercase tracking-tight">{name}</Text>
          </View>

          {status ? (
            <Text className="text-gray text-xs uppercase tracking-widest text-center mb-4">
              status · {status}
            </Text>
          ) : null}

          <View className="gap-3">
            <TouchableOpacity
              className="border-2 border-borders py-3 items-center"
              onPress={() => onSetStatus('learning')}
            >
              <Text className="text-text text-sm font-bold uppercase tracking-widest">
                Target as currently learning
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-borders py-3 items-center"
              onPress={() => onSetStatus('completed')}
            >
              <Text className="text-text text-sm font-bold uppercase tracking-widest">
                Complete learning
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-accent-2 py-3 items-center"
              onPress={onRemove}
            >
              <Text className="text-accent-2 text-sm font-bold uppercase tracking-widest">
                Delete from learning
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
