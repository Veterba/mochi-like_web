import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';

export default function SignInPrompt({ title = 'Sign in required', message }) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 20, marginBottom: 12, textAlign: 'center' }}>
        {title}
      </Text>
      {message ? (
        <Text style={{ color: theme.subtext, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>{message}</Text>
      ) : null}
      <TouchableOpacity
        style={{ backgroundColor: theme.text, paddingHorizontal: 40, paddingVertical: 16, marginBottom: 16 }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: theme.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={{ color: theme.subtext, fontSize: 14 }}>
          No account?{' '}
          <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase' }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
