import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { RootStackParamList } from './types';
import { useAppSelector } from '../hooks/redux';
import { AuthScreen } from '../screens/AuthScreen';
import { TabsNavigator } from './TabsNavigator';
import { ReaderScreen } from '../screens/ReaderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator({ theme }: { theme: AppTheme }) {
  const token = useAppSelector(state => state.auth.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.bg } }}>
      {!token ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabsNavigator} />
          <Stack.Screen name="Reader" component={ReaderScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
