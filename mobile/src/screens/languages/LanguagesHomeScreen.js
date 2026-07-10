import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { languages, accentColors } from '../../assets/data';
import { guides } from '../../assets/guides';
import LangCard from '../../components/languages/LangCard';
import LangPopup from '../../components/languages/LangPopup';
import useLearning from '../../hooks/useLearning';
import { useTheme } from '../../hooks/useTheme';

export default function LanguagesHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { statuses, setStatus, remove } = useLearning();
  const [popup, setPopup] = useState(null);
  const { theme } = useTheme();

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
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingHorizontal: 16, paddingTop: insets.top + 12 }}>
      <Text style={{ color: theme.text, fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 4, paddingHorizontal: 8 }}>
        LANGUAGES
      </Text>
      <Text style={{ color: theme.subtext, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24, paddingHorizontal: 8 }}>
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
              theme={theme}
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
          theme={theme}
        />
      )}
    </View>
  );
}
