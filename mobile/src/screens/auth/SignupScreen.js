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

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
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

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold uppercase text-text mb-8 tracking-widest">
            SIGN UP
          </Text>

          <View className="border-2 border-borders bg-background mb-4 p-3">
            <TextInput
              className="text-text text-base"
              placeholder="Email"
              placeholderTextColor="#989c9a"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="border-2 border-borders bg-background mb-4 p-3">
            <TextInput
              className="text-text text-base"
              placeholder="Login"
              placeholderTextColor="#989c9a"
              value={loginVal}
              onChangeText={setLoginVal}
              autoCapitalize="none"
            />
          </View>

          <View className="border-2 border-borders bg-background mb-2 p-3">
            <TextInput
              className="text-text text-base"
              placeholder="Password"
              placeholderTextColor="#989c9a"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text className="text-gray text-xs mb-4">
            At least 8 characters, one uppercase letter, one lowercase letter and one digit
          </Text>

          <View className="border-2 border-borders bg-background mb-6 p-3">
            <TextInput
              className="text-text text-base"
              placeholder="Confirm password"
              placeholderTextColor="#989c9a"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {error ? (
            <Text className="text-accent-2 mb-4 text-sm font-bold">{error}</Text>
          ) : null}

          <TouchableOpacity
            className="bg-text py-4 items-center mb-6"
            onPress={handleSignup}
            disabled={pending}
          >
            <Text className="text-background font-bold uppercase tracking-widest">
              {pending ? 'CREATING...' : 'CREATE ACCOUNT'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-gray text-center text-sm">
              Already have an account?{' '}
              <Text className="text-text font-bold uppercase">SIGN IN</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
