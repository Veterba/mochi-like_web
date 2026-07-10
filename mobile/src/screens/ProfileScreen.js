import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';
import useActivity from '../hooks/useActivity';
import useLearning from '../hooks/useLearning';
import { useTheme } from '../hooks/useTheme';
import { api } from '../api/client';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import LearningList from '../components/profile/LearningList';
import EditProfileModal from '../components/profile/EditProfileModal';
import SettingsModal from '../components/SettingsModal';
import SignInPrompt from '../components/SignInPrompt';

function dayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

function currentStreak(days) {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (set.has(dayKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function StatCard({ label, value, color, theme }) {
  return (
    <View style={{ flex: 1, borderWidth: 2, borderColor: theme.border, padding: 10, alignItems: 'center', minWidth: '30%' }}>
      <Text style={{ color: color || theme.text, fontSize: 22, fontWeight: '900' }}>{value}</Text>
      <Text style={{ color: theme.subtext, fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 2, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}

export default function ProfileScreen(props) {
  const { user } = useAuth();

  if (!user) {
    return (
      <SignInPrompt
        title="Profile"
        message="Sign in to track your activity streak, learning languages and profile."
      />
    );
  }

  return <ProfileInner {...props} />;
}

function ProfileInner({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { nickname, avatar, update } = useProfile();
  const { days } = useActivity();
  const { statuses } = useLearning();
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [flashStats, setFlashStats] = useState({ cardsAdded: 0, cardsLearned: 0 });

  useEffect(() => {
    api('/flashcards/stats').then(setFlashStats).catch(() => {});
  }, []);

  const streak = currentStreak(days);
  const learningCount = Object.values(statuses).filter((s) => s === 'learning').length;
  const completedCount = Object.values(statuses).filter((s) => s === 'completed').length;

  const handleSave = async (patch) => {
    await update(patch).catch(() => {});
    setEditing(false);
  };

  const goToLanguages = () => {
    navigation?.getParent()?.navigate('Languages');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 24, paddingTop: insets.top + 24, paddingBottom: 24 }}
    >
      {/* Header card */}
      <View style={{ borderWidth: 2, borderColor: theme.border, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 64, height: 64, borderWidth: 2, borderColor: theme.border }} />
        ) : (
          <View style={{ width: 64, height: 64, borderWidth: 2, borderColor: theme.border, backgroundColor: theme.elevated }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -0.5 }}>
            {nickname}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <TouchableOpacity
              style={{ borderWidth: 2, borderColor: '#4F6815', paddingHorizontal: 12, paddingVertical: 4 }}
              onPress={() => setEditing(true)}
            >
              <Text style={{ color: '#4F6815', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderWidth: 2, borderColor: '#A31E21', paddingHorizontal: 12, paddingVertical: 4 }}
              onPress={logout}
            >
              <Text style={{ color: '#A31E21', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                Log Out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderWidth: 2, borderColor: theme.border, paddingHorizontal: 10, paddingVertical: 4 }}
              onPress={() => setShowSettings(true)}
            >
              <Ionicons name="settings-outline" size={14} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats — 2 rows of 3 */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <StatCard label="Day streak" value={streak} color="#d29f22" theme={theme} />
        <StatCard label="Active days" value={days.length} color="#4F6815" theme={theme} />
        <StatCard label="Learning" value={learningCount} theme={theme} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <StatCard label="Completed" value={completedCount} color="#4F6815" theme={theme} />
        <StatCard label="Cards added" value={flashStats.cardsAdded} theme={theme} />
        <StatCard label="Cards learned" value={flashStats.cardsLearned} color="#d29f22" theme={theme} />
      </View>

      <ActivityHeatmap days={days} theme={theme} />

      <LearningList statuses={statuses} onGoToLanguages={goToLanguages} theme={theme} />

      {editing && (
        <EditProfileModal
          nickname={nickname}
          avatar={avatar}
          onSave={handleSave}
          onClose={() => setEditing(false)}
          theme={theme}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </ScrollView>
  );
}
