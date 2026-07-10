import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { accentHex } from '../../assets/data';

export default function LangCard({ name, accentKey, status, onPress, onDotPress, available, theme }) {
  const color = accentHex[accentKey] ?? '#1c1e24';

  const dotColor =
    status === 'learning' ? '#d29f22'
    : status === 'completed' ? '#4F6815'
    : 'transparent';

  return (
    <Pressable
      onPress={available ? onPress : undefined}
      style={{ flex: 1, margin: 4 }}
    >
      <View
        style={{ borderColor: color, borderWidth: 2, opacity: available ? 1 : 0.4, aspectRatio: 4 / 3, alignItems: 'center', justifyContent: 'center', position: 'relative' }}
      >
        {/* status dot */}
        <TouchableOpacity
          onPress={available ? onDotPress : undefined}
          style={{
            position: 'absolute', top: 6, right: 6,
            width: 14, height: 14,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: color,
            backgroundColor: dotColor,
          }}
        />

        <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: -0.5, fontSize: 14, textAlign: 'center', paddingHorizontal: 8 }}>
          {name}
        </Text>

        {!available && (
          <View style={{ position: 'absolute', bottom: 4, right: 8 }}>
            <Text style={{ color, fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 'bold' }}>
              soon
            </Text>
          </View>
        )}

        {status && available && (
          <View style={{ position: 'absolute', bottom: 4, left: 8 }}>
            <Text style={{ color, fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 'bold' }}>
              {status}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
