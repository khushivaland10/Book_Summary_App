import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { ChapterCard } from '../components/ChapterCard';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { darkTheme, lightTheme } from '../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Chapters'>, NativeStackScreenProps<RootStackParamList>>;

export function ChaptersScreen({ navigation }: Props) {
  const { chapters, progress } = useAppSelector(state => state.library);
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const done = Object.values(progress).filter(item => item.completed).length;

  return (
    <Screen>
      <Text style={styles.kicker}>ALL CHAPTERS</Text>
      <Text weight="serif" style={styles.title}>Rich Dad Poor Dad</Text>
      <View style={styles.progressRow}>
        <View style={[styles.track, { backgroundColor: theme.colors.border }]}><View style={[styles.fill, { width: `${Math.max(10, (done / chapters.length) * 100)}%`, backgroundColor: theme.colors.primary }]} /></View>
        <Text style={{ color: theme.colors.muted }}>{done}/{chapters.length} chapters</Text>
      </View>
      {chapters.map(chapter => <ChapterCard key={chapter._id} chapter={chapter} onPress={() => navigation.navigate('Reader', { chapterId: chapter._id })} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { fontSize: 11, letterSpacing: 1.6, color: '#8d7c73', fontWeight: '700' },
  title: { fontSize: 26, lineHeight: 34, marginBottom: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  track: { height: 5, borderRadius: 10, flex: 1 },
  fill: { height: 5, borderRadius: 10 }
});
