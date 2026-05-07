import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { darkTheme, lightTheme } from '../theme';

export function Text({ style, weight = 'regular', ...props }: TextProps & { weight?: 'regular' | 'bold' | 'serif' }) {
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  return <RNText {...props} style={[styles.base, { color: theme.colors.text }, weight === 'bold' && styles.bold, weight === 'serif' && styles.serif, style]} />;
}

const styles = StyleSheet.create({
  base: { fontSize: 14 },
  bold: { fontWeight: '700' },
  serif: { fontFamily: 'serif', fontWeight: '700' }
});
