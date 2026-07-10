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

const HEADER_OPTS = {
  headerStyle: { backgroundColor: '#F9F7F5' },
  headerTintColor: '#1B1717',
  headerTitleStyle: { fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  headerShadowVisible: false,
  headerBackTitle: '',
};

function LanguagesStack() {
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

  // Flashcards live on the user's account — guests get a sign-in prompt.
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // Glassy translucent tab bar: it floats over content (position
        // absolute) with a blur behind it, iOS-style. Screens add bottom
        // padding so their last items aren't hidden underneath.
        tabBarStyle: {
          position: 'absolute',
          borderTopColor: '#1c1e24',
          borderTopWidth: 2,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#F9F7F5',
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView tint="light" intensity={40} style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarActiveTintColor: '#1B1717',
        tabBarInactiveTintColor: '#989c9a',
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

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F5' }}>
        <ActivityIndicator color="#1B1717" />
      </View>
    );
  }

  // Browse-first, like the web app: the tabs are always available and auth
  // screens are pushed on demand. Account-backed tabs (Flashcards, Profile)
  // show a SignInPrompt for guests.
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

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
