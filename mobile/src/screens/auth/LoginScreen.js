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
import { useTheme } from '../../hooks/useTheme';

export default function LoginScreen({ navigation }) {
  const { login, resend } = useAuth();
  const { theme } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleLogin = async () => {
    setError('');
    setPending(true);
    try {
      await login({ identifier, password });
      navigation.popToTop();
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (msg === 'Email not verified' || err.status === 403) {
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
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 32 }}>
            SIGN IN
          </Text>

          <View style={{ borderWidth: 2, borderColor: theme.border, backgroundColor: theme.bg, marginBottom: 16, padding: 12 }}>
            <TextInput
              style={{ color: theme.text, fontSize: 16 }}
              placeholder="Email or login"
              placeholderTextColor={theme.subtext}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={{ borderWidth: 2, borderColor: theme.border, backgroundColor: theme.bg, marginBottom: 24, padding: 12 }}>
            <TextInput
              style={{ color: theme.text, fontSize: 16 }}
              placeholder="Password"
              placeholderTextColor={theme.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? (
            <Text style={{ color: '#A31E21', marginBottom: 16, fontSize: 13, fontWeight: 'bold' }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={{ backgroundColor: theme.text, paddingVertical: 16, alignItems: 'center', marginBottom: 24 }}
            onPress={handleLogin}
            disabled={pending}
          >
            <Text style={{ color: theme.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
              {pending ? 'SIGNING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: theme.subtext, textAlign: 'center', fontSize: 14 }}>
              No account?{' '}
              <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase' }}>SIGN UP</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 24 }} onPress={() => navigation.popToTop()}>
            <Text style={{ color: theme.subtext, textAlign: 'center', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>
              ← Continue without an account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
