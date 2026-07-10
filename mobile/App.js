import './global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { SettingsProvider } from './src/hooks/useSettings';
import { ThemeProvider, useTheme } from './src/hooks/useTheme';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import VerifyScreen from './src/screens/auth/VerifyScreen';
import TutorScreen from './src/screens/TutorScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LanguagesHomeScreen from './src/screens/languages/LanguagesHomeScreen';
import LanguageTopicsScreen from './src/screens/languages/LanguageTopicsScreen';
import TopicDetailScreen from './src/screens/languages/TopicDetailScreen';
import FlashcardsHomeScreen from './src/screens/flashcards/FlashcardsHomeScreen';
import TopicScreen from './src/screens/flashcards/TopicScreen';
import ShuffleScreen from './src/screens/flashcards/ShuffleScreen';
import { DecksProvider } from './src/hooks/useDecks';
import SignInPrompt from './src/components/SignInPrompt';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const LangStack = createNativeStackNavigator();
const FlashStack = createNativeStackNavigator();

function LanguagesStack() {
  const { theme } = useTheme();
  const HEADER_OPTS = {
    headerStyle: { backgroundColor: theme.bg },
    headerTintColor: theme.text,
    headerTitleStyle: { fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    headerShadowVisible: false,
    headerBackTitle: '',
  };
  return (
    <LangStack.Navigator screenOptions={{ ...HEADER_OPTS, headerShown: true }}>
      <LangStack.Screen name="LanguagesHome" component={LanguagesHomeScreen} options={{ headerShown: false }} />
      <LangStack.Screen
        name="LanguageTopics"
        component={LanguageTopicsScreen}
        options={({ route }) => ({ title: route.params?.name ?? 'Language' })}
      />
      <LangStack.Screen name="TopicDetail" component={TopicDetailScreen} options={({ route }) => ({ title: route.params?.topic?.title ?? 'Topic' })} />
    </LangStack.Navigator>
  );
}

function FlashcardsStack() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const HEADER_OPTS = {
    headerStyle: { backgroundColor: theme.bg },
    headerTintColor: theme.text,
    headerTitleStyle: { fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    headerShadowVisible: false,
    headerBackTitle: '',
  };

  if (!user) {
    return (
      <SignInPrompt
        title="Flashcards"
        message="Your folders, topics and cards are saved to your account. Sign in to start building decks."
      />
    );
  }

  return (
    <DecksProvider>
      <FlashStack.Navigator screenOptions={{ ...HEADER_OPTS, headerShown: true }}>
        <FlashStack.Screen name="FlashcardsHome" component={FlashcardsHomeScreen} options={{ title: 'Flashcards' }} />
        <FlashStack.Screen name="Topic" component={TopicScreen} options={({ route }) => ({ title: route.params?.name ?? 'Topic' })} />
        <FlashStack.Screen name="Shuffle" component={ShuffleScreen} options={({ route }) => ({ title: route.params?.name ?? 'Shuffle' })} />
      </FlashStack.Navigator>
    </DecksProvider>
  );
}

const TAB_ICONS = {
  Tutor: ['chatbubble-ellipses', 'chatbubble-ellipses-outline'],
  Languages: ['globe', 'globe-outline'],
  Flashcards: ['albums', 'albums-outline'],
  Profile: ['person', 'person-outline'],
};

function AppTabs() {
  const { theme, scheme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopColor: scheme === 'dark' ? 'rgba(58,58,58,0.8)' : 'rgba(28,30,36,0.12)',
          borderTopWidth: StyleSheet.hairlineWidth,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.bg,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              tint={scheme === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
              intensity={90}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.subtext,
        tabBarLabelStyle: {
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: 10,
          letterSpacing: 1,
        },
        tabBarIcon: ({ focused, color }) => {
          const [active, inactive] = TAB_ICONS[route.name] ?? [];
          return <Ionicons name={focused ? active : inactive} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tutor" component={TutorScreen} />
      <Tab.Screen name="Languages" component={LanguagesStack} />
      <Tab.Screen name="Flashcards" component={FlashcardsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { ready } = useAuth();
  const { theme } = useTheme();

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={AppTabs} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Signup" component={SignupScreen} />
        <RootStack.Screen name="Verify" component={VerifyScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function AppInner() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <ThemeProvider>
            <AppInner />
          </ThemeProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
