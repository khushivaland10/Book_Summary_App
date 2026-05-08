import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { ChapterCard } from '../components/ChapterCard';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTheme } from '../redux/slices/preferencesSlice';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { darkTheme, lightTheme } from '../theme';
import { dailyQuotes } from '../data/seed';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Home'>, NativeStackScreenProps<RootStackParamList>>;

const categories = ['Investing', 'Money Mindset', 'Productivity', 'Psychology'];

export function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { chapters, bookmarks, progress, recentViews } = useAppSelector(state => state.library);
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const completed = Object.values(progress).filter(item => item.completed).length;
  const today = new Date().toDateString();
  const readToday = Object.values(progress).filter(item => item.completed && new Date(item.updatedAt).toDateString() === today).length;
  const current = chapters.find(ch => !progress[ch._id]?.completed) || chapters[0];
  const recentChapters = recentViews
    .map(view => chapters.find(chapter => chapter._id === view.chapterId))
    .filter((chapter): chapter is NonNullable<typeof chapter> => Boolean(chapter))
    .slice(0, 3);

  return (
    <Screen>
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.kicker, { color: theme.colors.muted }]}>OFFLINE LIBRARY</Text>
          <Text weight="serif" style={styles.pageTitle}>Book Summary</Text>
        </View>
        <Pressable onPress={() => dispatch(toggleTheme())} style={[styles.iconButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={18} color={theme.colors.primary} />
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.navigate('Chapters')} style={[styles.bookCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={[styles.cover, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="book-outline" size={30} color="#fff" />
        </View>
        <View style={styles.bookBody}>
          <Text style={[styles.kicker, { color: theme.colors.muted }]}>FEATURED BOOK</Text>
          <Text weight="serif" style={styles.title}>Rich Dad Poor Dad</Text>
          <Text style={{ color: theme.colors.muted }}>Robert T. Kiyosaki</Text>
          <View style={styles.badges}>
            <Badge icon="star" label="Bestseller" />
            <Badge icon="cloud-done-outline" label="Offline available" />
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
      </Pressable>

      <View style={styles.stats}>
        <Stat icon="flame-outline" value={Math.max(1, completed)} label={`${readToday} read today`} />
        <Stat icon="download-outline" value={chapters.length} label="Downloaded" />
        <Stat icon="bookmark-outline" value={bookmarks.length} label="Saved" />
      </View>

      <View style={styles.sectionRow}>
        <Text weight="serif" style={styles.sectionTitle}>Continue Reading</Text>
        <Pressable onPress={() => navigation.navigate('Chapters')} style={styles.linkButton}>
          <Text weight="bold" style={{ color: theme.colors.primary }}>All</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
        </Pressable>
      </View>
      {current && <ChapterCard compact chapter={current} onPress={() => navigation.navigate('Reader', { chapterId: current._id })} />}

      <View style={[styles.quote, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.quoteKicker}>DAILY QUOTE</Text>
        <Text weight="serif" style={styles.quoteText}>"{dailyQuotes[0]}"</Text>
        <Text style={styles.quoteAuthor}>- Robert Kiyosaki</Text>
      </View>

      <Text weight="serif" style={styles.sectionTitle}>Categories</Text>
      <View style={styles.chips}>
        {categories.map(category => (
          <View key={category} style={[styles.chip, { backgroundColor: theme.colors.cream, borderColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.primary }}>{category}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Text weight="serif" style={styles.sectionTitle}>Chapters Preview</Text>
        <Pressable onPress={() => navigation.navigate('Chapters')} style={styles.linkButton}>
          <Text weight="bold" style={{ color: theme.colors.primary }}>See all</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
        </Pressable>
      </View>
      {chapters.slice(0, 3).map(chapter => <ChapterCard key={chapter._id} compact chapter={chapter} onPress={() => navigation.navigate('Reader', { chapterId: chapter._id })} />)}

      <Text weight="serif" style={styles.sectionTitle}>Recently Viewed</Text>
      {recentChapters.length > 0 ? (
        recentChapters.map(chapter => <ChapterCard key={chapter._id} compact chapter={chapter} onPress={() => navigation.navigate('Reader', { chapterId: chapter._id })} />)
      ) : (
        <View style={[styles.empty, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="time-outline" size={22} color={theme.colors.muted} />
          <Text style={{ color: theme.colors.muted }}>Open a chapter to see it here.</Text>
        </View>
      )}
    </Screen>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  return (
    <View style={[styles.stat, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Ionicons name={icon} size={21} color={theme.colors.primary} />
      <Text weight="bold" style={{ color: theme.colors.primary, marginTop: 8 }}>{value}</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

function Badge({ icon, label }: { icon: string; label: string }) {
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  return (
    <View style={[styles.badge, { backgroundColor: theme.colors.primarySoft }]}>
      <Ionicons name={icon} size={12} color={theme.colors.primary} />
      <Text weight="bold" style={{ color: theme.colors.primary, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  iconButton: { width: 38, height: 38, borderWidth: 1, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  bookCard: { borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  cover: { width: 66, height: 88, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bookBody: { flex: 1 },
  kicker: { fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  title: { fontSize: 24, lineHeight: 31 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  stat: { flex: 1, borderWidth: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  linkButton: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36, paddingLeft: 12 },
  quote: { borderRadius: 14, padding: 20, marginVertical: 16 },
  quoteKicker: { color: '#dbeafe', fontWeight: '700', letterSpacing: 1.2, fontSize: 12 },
  quoteText: { color: '#fff', fontSize: 19, lineHeight: 28, marginVertical: 12 },
  quoteAuthor: { color: '#fff' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  empty: { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 8, marginBottom: 12 }
});
