import './global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './src/hooks/useAuth';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import VerifyScreen from './src/screens/auth/VerifyScreen';
import HomeScreen from './src/screens/HomeScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LanguagesHomeScreen from './src/screens/languages/LanguagesHomeScreen';
import EnglishTopicsScreen from './src/screens/languages/EnglishTopicsScreen';
import TopicDetailScreen from './src/screens/languages/TopicDetailScreen';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const LangStack = createNativeStackNavigator();

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
      <LangStack.Screen name="EnglishTopics" component={EnglishTopicsScreen} options={{ title: 'English' }} />
      <LangStack.Screen name="TopicDetail" component={TopicDetailScreen} options={({ route }) => ({ title: route.params?.topic?.title ?? 'Topic' })} />
    </LangStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="Verify" component={VerifyScreen} />
    </AuthStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F9F7F5',
          borderTopColor: '#1c1e24',
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: '#1B1717',
        tabBarInactiveTintColor: '#989c9a',
        tabBarLabelStyle: {
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: 10,
          letterSpacing: 1,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Languages" component={LanguagesStack} />
      <Tab.Screen name="Flashcards" component={FlashcardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F5' }}>
        <ActivityIndicator color="#1B1717" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
