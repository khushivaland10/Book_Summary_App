import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { useAppSelector } from '../hooks/redux';
import { darkTheme, lightTheme } from '../theme';

export function ProgressRing({ percent }: { percent: number }) {
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  return (
    <View style={[styles.ring, { borderColor: theme.colors.border }]}>
      <View style={[styles.arc, { borderTopColor: theme.colors.primary, borderRightColor: theme.colors.primary }]} />
      <Text weight="bold" style={styles.text}>{Math.round(percent * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { width: 52, height: 52, borderRadius: 26, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  arc: { position: 'absolute', width: 52, height: 52, borderRadius: 26, borderWidth: 4, borderColor: 'transparent', transform: [{ rotate: '25deg' }] },
  text: { fontSize: 12 }
});
