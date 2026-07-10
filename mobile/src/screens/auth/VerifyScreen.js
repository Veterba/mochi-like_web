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
import { useTheme } from '../../hooks/useTheme';

export default function VerifyScreen({ route, navigation }) {
  const { email } = route.params || {};
  const { verify, resend } = useAuth();
  const { theme } = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleVerify = async () => {
    setError('');
    setPending(true);
    try {
      await verify(email, code);
      navigation.popToTop();
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
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>
          VERIFY EMAIL
        </Text>

        <Text style={{ color: theme.subtext, marginBottom: 32, fontSize: 14 }}>
          We sent a 6-digit code to{' '}
          <Text style={{ color: theme.text, fontWeight: 'bold' }}>{email}</Text>
        </Text>

        <View style={{ borderWidth: 2, borderColor: theme.border, backgroundColor: theme.bg, marginBottom: 24, padding: 12 }}>
          <TextInput
            style={{ color: theme.text, fontSize: 16, letterSpacing: 4 }}
            placeholder="6-digit code"
            placeholderTextColor={theme.subtext}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        {error ? (
          <Text style={{ color: '#A31E21', marginBottom: 16, fontSize: 13, fontWeight: 'bold' }}>
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={{ backgroundColor: theme.text, paddingVertical: 16, alignItems: 'center', marginBottom: 24 }}
          onPress={handleVerify}
          disabled={pending}
        >
          <Text style={{ color: theme.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
            {pending ? 'CONFIRMING...' : 'CONFIRM'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend}>
          <Text style={{ color: theme.subtext, textAlign: 'center', fontSize: 14 }}>
            Didn't get it?{' '}
            <Text style={{ color: theme.text, fontWeight: 'bold', textTransform: 'uppercase' }}>RESEND CODE</Text>
          </Text>
        </TouchableOpacity>

        {resendMsg ? (
          <Text style={{ color: '#4F6815', textAlign: 'center', fontSize: 14, marginTop: 8, fontWeight: 'bold' }}>
            {resendMsg}
          </Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
