import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Chapter } from '../types';
import { useAppSelector } from '../hooks/redux';
import { darkTheme, lightTheme, radius } from '../theme';
import { Text } from './Text';

export function ChapterCard({ chapter, onPress, compact = false }: { chapter: Chapter; onPress: () => void; compact?: boolean }) {
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const cardBackground = compact || mode === 'dark' ? theme.colors.card : chapter.accent;

  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: cardBackground, borderColor: theme.colors.border }, compact && styles.compact]}>
      <Ionicons name={chapter.icon} size={compact ? 24 : 30} color={theme.colors.primary} />
      <View style={styles.body}>
        <Text style={[styles.kicker, { color: theme.colors.muted }]}>CHAPTER {chapter.chapterNumber}</Text>
        <Text weight="serif" style={compact ? styles.compactTitle : styles.title}>{chapter.title}</Text>
        {!compact && <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{chapter.subtitle}</Text>}
        {!compact && (
          <View style={styles.minutesRow}>
            <Ionicons name="time-outline" size={13} color={theme.colors.muted} />
            <Text style={[styles.minutes, { color: theme.colors.muted }]}>{chapter.minutes} min read</Text>
          </View>
        )}
      </View>
      {compact && <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 110, borderWidth: 1, borderRadius: radius.md, padding: 18, marginBottom: 14, flexDirection: 'row', gap: 12 },
  compact: { minHeight: 64, alignItems: 'center', paddingVertical: 12 },
  body: { flex: 1 },
  kicker: { fontSize: 11, letterSpacing: 1.4, color: '#8d7c73', fontWeight: '700' },
  title: { fontSize: 19, lineHeight: 26, marginTop: 8 },
  compactTitle: { fontSize: 15, lineHeight: 21, marginTop: 2 },
  subtitle: { marginTop: 4 },
  minutesRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  minutes: { fontSize: 12 }
});
