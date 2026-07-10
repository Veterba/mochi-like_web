import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileModal({ nickname, avatar, onSave, onClose, theme }) {
  const [nick, setNick] = useState(nickname ?? '');
  const [av, setAv] = useState(avatar ?? null);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo library access to change your photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      setAv('data:image/jpeg;base64,' + result.assets[0].base64);
    }
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}} style={{ backgroundColor: theme.surface, borderWidth: 2, borderColor: theme.border, padding: 32 }}>
          <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 }}>Edit Profile</Text>

          {/* Avatar preview */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            {av ? (
              <Image source={{ uri: av }} style={{ width: 96, height: 96, borderWidth: 2, borderColor: theme.border }} />
            ) : (
              <View style={{ width: 96, height: 96, borderWidth: 2, borderColor: theme.border, backgroundColor: theme.elevated }} />
            )}
            <TouchableOpacity
              onPress={pickPhoto}
              style={{ borderWidth: 1, borderColor: theme.border, paddingHorizontal: 12, paddingVertical: 4, marginTop: 12 }}
            >
              <Text style={{ color: theme.text, fontSize: 10, textTransform: 'uppercase' }}>Change photo</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Nickname</Text>
          <TextInput
            value={nick}
            onChangeText={setNick}
            style={{ borderWidth: 1, borderColor: theme.border, paddingHorizontal: 12, paddingVertical: 8, color: theme.text, fontSize: 14, backgroundColor: theme.bg }}
            placeholderTextColor={theme.subtext}
          />

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              style={{ flex: 1, borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              onPress={() => onSave({ nickname: nick.trim() || 'Guest', avatar: av })}
            >
              <Text style={{ color: theme.text, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, borderWidth: 2, borderColor: theme.border, paddingVertical: 12, alignItems: 'center' }}
              onPress={onClose}
            >
              <Text style={{ color: theme.subtext, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
