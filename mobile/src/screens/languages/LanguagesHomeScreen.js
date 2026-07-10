import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { languages, accentColors } from '../../assets/data';
import { guides } from '../../assets/guides';
import LangCard from '../../components/languages/LangCard';
import LangPopup from '../../components/languages/LangPopup';
import useLearning from '../../hooks/useLearning';

export default function LanguagesHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { statuses, setStatus, remove } = useLearning();
  const [popup, setPopup] = useState(null); // name of the language

  const handleSetStatus = (status) => {
    setStatus(popup, status);
    setPopup(null);
  };

  const handleRemove = () => {
    remove(popup);
    setPopup(null);
  };

  const popupIndex = popup ? languages.indexOf(popup) : -1;
  const popupAccent = popupIndex >= 0 ? accentColors[popupIndex % accentColors.length] : 'accent-1';

  return (
    <View className="flex-1 bg-background px-4" style={{ paddingTop: insets.top + 12 }}>
      <Text className="text-3xl font-bold uppercase text-text tracking-widest mb-1 px-2">
        LANGUAGES
      </Text>
      <Text className="text-gray text-xs uppercase tracking-widest mb-6 px-2">
        English, Norwegian, German and Spanish currently available
      </Text>

      <FlatList
        data={languages}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => {
          const accentKey = accentColors[index % accentColors.length];
          const slug = item.toLowerCase();
          const available = Boolean(guides[slug]);
          return (
            <LangCard
              name={item}
              accentKey={accentKey}
              status={statuses[item]}
              available={available}
              onPress={() => navigation.navigate('LanguageTopics', { slug, name: item })}
              onDotPress={() => setPopup(item)}
            />
          );
        }}
      />

      {popup && (
        <LangPopup
          name={popup}
          accentKey={popupAccent}
          status={statuses[popup]}
          onSetStatus={handleSetStatus}
          onRemove={handleRemove}
          onClose={() => setPopup(null)}
        />
      )}
    </View>
  );
}
