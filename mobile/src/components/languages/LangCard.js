import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { accentHex } from '../../assets/data';

export default function LangCard({ name, accentKey, status, onPress, onDotPress, available }) {
  const color = accentHex[accentKey] ?? '#1c1e24';

  const dotColor =
    status === 'learning' ? '#d29f22'
    : status === 'completed' ? '#4F6815'
    : 'transparent';

  const card = (
    <View
      style={{ borderColor: color, borderWidth: 2, opacity: available ? 1 : 0.4 }}
      className="aspect-[4/3] m-1 flex-1 items-center justify-center relative"
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

      <Text className="text-text font-bold uppercase tracking-tight text-base text-center px-2">
        {name}
      </Text>

      {!available && (
        <View className="absolute bottom-1 right-2">
          <Text style={{ color, fontSize: 9 }} className="uppercase tracking-widest font-bold">
            soon
          </Text>
        </View>
      )}

      {status && available && (
        <View className="absolute bottom-1 left-2">
          <Text style={{ color, fontSize: 9 }} className="uppercase tracking-widest font-bold">
            {status}
          </Text>
        </View>
      )}
    </View>
  );

  if (!available) return card;

  return (
    <Pressable onPress={onPress} className="flex-1">
      {card}
    </Pressable>
  );
}
