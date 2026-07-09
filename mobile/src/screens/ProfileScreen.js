import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';
import useActivity from '../hooks/useActivity';
import useLearning from '../hooks/useLearning';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import LearningList from '../components/profile/LearningList';
import EditProfileModal from '../components/profile/EditProfileModal';
import SignInPrompt from '../components/SignInPrompt';

// Guest gate lives in a wrapper so ProfileInner's hooks only ever run for a
// signed-in user (early returns between hooks would break the hook order).
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
  const [editing, setEditing] = useState(false);

  const handleSave = async (patch) => {
    await update(patch).catch(() => {});
    setEditing(false);
  };

  const goToLanguages = () => {
    navigation?.getParent()?.navigate('Languages');
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: insets.top + 24 }}>
      {/* Header card */}
      <View className="border-2 border-borders p-4 mb-4 flex-row items-center gap-4">
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: 64, height: 64, borderWidth: 2, borderColor: '#1c1e24' }}
          />
        ) : (
          <View style={{ width: 64, height: 64, borderWidth: 2, borderColor: '#1c1e24', backgroundColor: '#EFEFEF' }} />
        )}
        <View className="flex-1">
          <Text className="text-text text-xl font-black uppercase tracking-tight">{nickname}</Text>
          <View className="flex-row gap-2 mt-2 flex-wrap">
            <TouchableOpacity
              className="border-2 border-accent-3 px-3 py-1"
              onPress={() => setEditing(true)}
            >
              <Text className="text-accent-3 text-xs font-bold uppercase tracking-widest">
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border-2 border-accent-2 px-3 py-1"
              onPress={logout}
            >
              <Text className="text-accent-2 text-xs font-bold uppercase tracking-widest">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ActivityHeatmap days={days} />

      <LearningList statuses={statuses} onGoToLanguages={goToLanguages} />

      {editing && (
        <EditProfileModal
          nickname={nickname}
          avatar={avatar}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      )}
    </ScrollView>
  );
}
