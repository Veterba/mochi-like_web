import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { languages, accentColors } from '../../assets/data';
import LangCard from '../../components/languages/LangCard';
import LangPopup from '../../components/languages/LangPopup';
import useLearning from '../../hooks/useLearning';

const AVAILABLE = new Set(['english']);

export default function LanguagesHomeScreen({ navigation }) {
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
    <View className="flex-1 bg-background px-4 pt-12">
      <Text className="text-3xl font-bold uppercase text-text tracking-widest mb-1 px-2">
        LANGUAGES
      </Text>
      <Text className="text-gray text-xs uppercase tracking-widest mb-6 px-2">
        only English currently available
      </Text>

      <FlatList
        data={languages}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item, index }) => {
          const accentKey = accentColors[index % accentColors.length];
          const available = AVAILABLE.has(item.toLowerCase());
          return (
            <LangCard
              name={item}
              accentKey={accentKey}
              status={statuses[item]}
              available={available}
              onPress={() => navigation.navigate('EnglishTopics')}
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
