import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileModal({ nickname, avatar, onSave, onClose }) {
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
        <Pressable onPress={() => {}} className="bg-background border-2 border-borders p-8">
          <Text className="text-gray text-xs uppercase tracking-widest mb-6">Edit Profile</Text>

          {/* Avatar preview */}
          <View className="items-center mb-4">
            {av ? (
              <Image source={{ uri: av }} style={{ width: 96, height: 96, borderWidth: 2, borderColor: '#1c1e24' }} />
            ) : (
              <View style={{ width: 96, height: 96, borderWidth: 2, borderColor: '#1c1e24', backgroundColor: '#EFEFEF' }} />
            )}
            <TouchableOpacity
              onPress={pickPhoto}
              className="border border-borders px-3 py-1 mt-3"
            >
              <Text className="text-text text-xs uppercase">Change photo</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray text-xs uppercase tracking-widest mb-2">Nickname</Text>
          <TextInput
            value={nick}
            onChangeText={setNick}
            className="border border-borders px-3 py-2 text-text bg-background"
            placeholderTextColor="#989c9a"
          />

          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              className="flex-1 border-2 border-borders py-3 items-center"
              onPress={() => onSave({ nickname: nick.trim() || 'Guest', avatar: av })}
            >
              <Text className="text-text text-sm font-bold uppercase tracking-widest">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border-2 border-borders py-3 items-center"
              onPress={onClose}
            >
              <Text className="text-gray text-sm font-bold uppercase tracking-widest">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
