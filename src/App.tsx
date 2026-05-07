import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { store, RootState, AppDispatch } from './redux/store';
import { hydrateAuth } from './redux/slices/authSlice';
import { hydrateLibrary, syncLibrary } from './redux/slices/librarySlice';
import { lightTheme, darkTheme } from './theme';

function Bootstrap() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    dispatch(hydrateAuth());
    dispatch(hydrateLibrary());
    dispatch(syncLibrary());
  }, [dispatch]);

  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.bg} />
      <RootNavigator theme={theme} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Bootstrap />
      </SafeAreaProvider>
    </Provider>
  );
}
