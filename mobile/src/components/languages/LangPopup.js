import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { accentHex } from '../../assets/data';

export default function LangPopup({ name, accentKey, status, onSetStatus, onRemove, onClose, theme }) {
  const color = accentHex[accentKey] ?? '#1c1e24';

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}} style={{ backgroundColor: theme.surface, borderWidth: 2, borderColor: theme.border, padding: 32 }}>
          {/* Language card preview */}
          <View
            style={{ borderColor: color, borderWidth: 2, aspectRatio: 4 / 3, marginBottom: 24, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: -0.5 }}>
              {name}
            </Text>
          </View>

          {status ? (
            <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 16 }}>
              status · {status}
            </Text>
          ) : null}

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{ borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              onPress={() => onSetStatus('learning')}
            >
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                Target as currently learning
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              onPress={() => onSetStatus('completed')}
            >
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                Complete learning
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ borderWidth: 2, borderColor: '#A31E21', paddingVertical: 12, alignItems: 'center' }}
              onPress={onRemove}
            >
              <Text style={{ color: '#A31E21', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                Delete from learning
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
