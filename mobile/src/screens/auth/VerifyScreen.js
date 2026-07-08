import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function VerifyScreen({ route }) {
  const { email } = route.params || {};
  const { verify, resend } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleVerify = async () => {
    setError('');
    setPending(true);
    try {
      await verify(email, code);
      // success: auth state change navigates automatically
    } catch (err) {
      setError(err.message || 'Invalid or expired code');
    } finally {
      setPending(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    try {
      await resend(email);
      setResendMsg('Sent!');
      setTimeout(() => setResendMsg(''), 3000);
    } catch (_) {
      setResendMsg('Failed to resend');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold uppercase text-text mb-4 tracking-widest">
          VERIFY EMAIL
        </Text>

        <Text className="text-gray mb-8 text-sm">
          We sent a 6-digit code to{' '}
          <Text className="text-text font-bold">{email}</Text>
        </Text>

        <View className="border-2 border-borders bg-background mb-6 p-3">
          <TextInput
            className="text-text text-base tracking-widest"
            placeholder="6-digit code"
            placeholderTextColor="#989c9a"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        {error ? (
          <Text className="text-accent-2 mb-4 text-sm font-bold">
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          className="bg-text py-4 items-center mb-6"
          onPress={handleVerify}
          disabled={pending}
        >
          <Text className="text-background font-bold uppercase tracking-widest">
            {pending ? 'CONFIRMING...' : 'CONFIRM'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend}>
          <Text className="text-gray text-center text-sm">
            Didn't get it?{' '}
            <Text className="text-text font-bold uppercase">RESEND CODE</Text>
          </Text>
        </TouchableOpacity>

        {resendMsg ? (
          <Text className="text-accent-3 text-center text-sm mt-2 font-bold">
            {resendMsg}
          </Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
