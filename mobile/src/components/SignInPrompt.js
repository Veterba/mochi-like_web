import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Shown in place of account-backed screens when browsing as a guest.
// 'Login'/'Signup' live in the root stack, so navigate() bubbles up from tabs.
export default function SignInPrompt({ title = 'Sign in required', message }) {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-text font-bold uppercase tracking-widest text-xl mb-3 text-center">
        {title}
      </Text>
      {message ? (
        <Text className="text-gray text-sm text-center mb-8">{message}</Text>
      ) : null}
      <TouchableOpacity
        className="bg-text px-10 py-4 mb-4"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-background font-bold uppercase tracking-widest">Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text className="text-gray text-sm">
          No account? <Text className="text-text font-bold uppercase">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
