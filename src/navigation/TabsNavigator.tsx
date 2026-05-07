import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../hooks/redux';
import { darkTheme, lightTheme } from '../theme';
import { TabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { ChaptersScreen } from '../screens/ChaptersScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const icons: Record<keyof TabParamList, string> = {
  Home: 'home-outline',
  Chapters: 'book-outline',
  Search: 'search-outline',
  Saved: 'bookmark-outline',
  Profile: 'person-outline'
};

export function TabsNavigator() {
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border, height: 68, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} color={color} size={size} />
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chapters" component={ChaptersScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
