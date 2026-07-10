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

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [loginVal, setLoginVal] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setPending(true);
    try {
      await signup({ email, login: loginVal, password, verify: confirmPassword });
      navigation.navigate('Verify', { email });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setPending(false);
    }
  };

  const field = (children, extraStyle) => (
    <View style={{ borderWidth: 2, borderColor: theme.border, backgroundColor: theme.bg, padding: 12, ...extraStyle }}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 32 }}>
            SIGN UP
          </Text>

          {field(
            <TextInput style={{ color: theme.text, fontSize: 16 }} placeholder="Email" placeholderTextColor={theme.subtext} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />,
            { marginBottom: 16 }
          )}
          {field(
            <TextInput style={{ color: theme.text, fontSize: 16 }} placeholder="Login" placeholderTextColor={theme.subtext} value={loginVal} onChangeText={setLoginVal} autoCapitalize="none" />,
            { marginBottom: 16 }
          )}
          {field(
            <TextInput style={{ color: theme.text, fontSize: 16 }} placeholder="Password" placeholderTextColor={theme.subtext} value={password} onChangeText={setPassword} secureTextEntry />,
            { marginBottom: 8 }
          )}

          <Text style={{ color: theme.subtext, fontSize: 12, marginBottom: 16 }}>
            At least 8 characters, one uppercase letter, one lowercase letter and one digit
          </Text>

          {field(
            <TextInput style={{ color: theme.text, fontSize: 16 }} placeholder="Confirm password" placeholderTextColor={theme.subtext} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />,
            { marginBottom: 24 }
          )}

          {error ? (
            <Text style={{ color: '#A31E21', marginBottom: 16, fontSize: 13, fontWeight: 'bold' }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={{ backgroundColor: theme.text, paddingVertical: 16, alignItems: 'center', marginBottom: 24 }}
            onPress={handleSignup}
            disabled={pending}
          >
            <Text style={{ color: theme.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
              {pending ? 'CREATING...' : 'CREATE ACCOUNT'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: theme.subtext, textAlign: 'center', fontSize: 14 }}>
              Already have an account?{' '}
              <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase' }}>SIGN IN</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
