import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const { login, resend } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleLogin = async () => {
    setError('');
    setPending(true);
    try {
      await login({ identifier, password });
      // auth state change navigates automatically
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (msg === 'Email not verified' || err.status === 403) {
        // if identifier looks like an email, resend and go to verify
        if (identifier.includes('@')) {
          try { await resend(identifier); } catch (_) {}
          navigation.navigate('Verify', { email: identifier });
        } else {
          setError(msg);
        }
      } else {
        setError(msg);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold uppercase text-text mb-8 tracking-widest">
            SIGN IN
          </Text>

          <View className="border-2 border-borders bg-background mb-4 p-3">
            <TextInput
              className="text-text text-base"
              placeholder="Email or login"
              placeholderTextColor="#989c9a"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="border-2 border-borders bg-background mb-6 p-3">
            <TextInput
              className="text-text text-base"
              placeholder="Password"
              placeholderTextColor="#989c9a"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? (
            <Text className="text-accent-2 mb-4 text-sm font-bold">{error}</Text>
          ) : null}

          <TouchableOpacity
            className="bg-text py-4 items-center mb-6"
            onPress={handleLogin}
            disabled={pending}
          >
            <Text className="text-background font-bold uppercase tracking-widest">
              {pending ? 'SIGNING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className="text-gray text-center text-sm">
              No account?{' '}
              <Text className="text-text font-bold uppercase">SIGN UP</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
