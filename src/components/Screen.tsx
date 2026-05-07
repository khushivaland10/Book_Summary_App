import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../hooks/redux';
import { darkTheme, lightTheme } from '../theme';

export function Screen({ children, scroll = true, style }: { children: React.ReactNode; scroll?: boolean; style?: ViewStyle }) {
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const content = <View style={[styles.inner, style]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      {scroll ? <ScrollView showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 24 }
});
