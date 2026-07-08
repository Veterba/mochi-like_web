import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-background px-6 pt-12">
      <Text className="text-3xl font-bold uppercase text-text tracking-widest mb-4">PROFILE</Text>

      {user && (
        <View className="border-2 border-borders p-4 mb-6">
          <Text className="text-text font-bold uppercase text-xs tracking-widest mb-1">
            {user.login || user.nickname}
          </Text>
          <Text className="text-gray text-sm">{user.email}</Text>
        </View>
      )}

      <Text className="text-gray text-sm mb-8">Coming in the next block</Text>

      <TouchableOpacity
        className="border-2 border-accent-2 py-3 items-center"
        onPress={logout}
      >
        <Text className="text-accent-2 font-bold uppercase tracking-widest text-sm">
          LOG OUT
        </Text>
      </TouchableOpacity>
    </View>
  );
}
