import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { ChapterCard } from '../components/ChapterCard';
import { ProgressRing } from '../components/ProgressRing';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTheme } from '../redux/slices/preferencesSlice';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { darkTheme, lightTheme } from '../theme';
import { dailyQuotes } from '../data/seed';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Home'>, NativeStackScreenProps<RootStackParamList>>;

export function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { chapters, bookmarks, progress } = useAppSelector(state => state.library);
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const completed = Object.values(progress).filter(item => item.completed).length;
  const current = chapters.find(ch => !progress[ch._id]?.completed) || chapters[0];
  const percent = chapters.length ? completed / chapters.length : 0;

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.cover, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="book-outline" size={28} color="#fff" />
        </View>
        <View style={styles.heroText}>
          <Text style={[styles.kicker, { color: theme.colors.muted }]}>BOOK SUMMARY</Text>
          <Text weight="serif" style={styles.title}>Rich Dad{'\n'}Poor Dad</Text>
          <Text style={{ color: theme.colors.muted }}>Robert T. Kiyosaki</Text>
          <Text style={{ color: theme.colors.primary }}>★★★★★ Bestseller</Text>
        </View>
        <Pressable onPress={() => dispatch(toggleTheme())} style={[styles.themeButton, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="moon-outline" size={18} color={theme.colors.muted} />
        </Pressable>
        <ProgressRing percent={percent} />
      </View>

      <View style={styles.stats}>
        <Stat icon="book-outline" value={chapters.length} label="Chapters" />
        <Stat icon="checkbox-outline" value={completed} label="Completed" />
        <Stat icon="bookmark-outline" value={bookmarks.length} label="Saved" />
      </View>

      <View style={styles.sectionRow}>
        <Text weight="serif" style={styles.sectionTitle}>Continue Reading</Text>
        <Text style={{ color: theme.colors.primary }}>All →</Text>
      </View>
      {current && <ChapterCard compact chapter={current} onPress={() => navigation.navigate('Reader', { chapterId: current._id })} />}

      <View style={[styles.quote, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.quoteKicker}>DAILY QUOTE</Text>
        <Text weight="serif" style={styles.quoteText}>"{dailyQuotes[0]}"</Text>
        <Text style={styles.quoteAuthor}>- Robert Kiyosaki</Text>
      </View>

      <View style={[styles.tip, { backgroundColor: theme.colors.cream, borderColor: theme.colors.border }]}>
        <Text style={[styles.kicker, { color: theme.colors.primary }]}>INVESTING</Text>
        <Text>The market always goes up and down. The wealthy use downturns as buying opportunities.</Text>
      </View>

      <View style={styles.sectionRow}>
        <Text weight="serif" style={styles.sectionTitle}>Chapters</Text>
        <Text style={{ color: theme.colors.primary }}>See all →</Text>
      </View>
      {chapters.slice(0, 3).map(chapter => <ChapterCard key={chapter._id} compact chapter={chapter} onPress={() => navigation.navigate('Reader', { chapterId: chapter._id })} />)}
    </Screen>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  return (
    <View style={[styles.stat, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Ionicons name={icon} size={22} color={theme.colors.primary} />
      <Text weight="bold" style={{ color: theme.colors.primary, marginTop: 8 }}>{value}</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  cover: { width: 58, height: 76, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  heroText: { flex: 1 },
  kicker: { fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  title: { fontSize: 25, lineHeight: 32 },
  themeButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  stat: { flex: 1, borderWidth: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 18 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18 },
  quote: { borderRadius: 14, padding: 22, marginVertical: 16 },
  quoteKicker: { color: '#fff4d7', fontWeight: '700', letterSpacing: 1.2, fontSize: 12 },
  quoteText: { color: '#fff', fontSize: 20, lineHeight: 29, marginVertical: 12 },
  quoteAuthor: { color: '#fff' },
  tip: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 16 }
});
