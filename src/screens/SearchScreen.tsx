import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { ChapterCard } from '../components/ChapterCard';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { darkTheme, lightTheme } from '../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Search'>, NativeStackScreenProps<RootStackParamList>>;

const topics = ['Investing', 'Money Mindset', 'Productivity', 'Psychology'];

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const chapters = useAppSelector(state => state.library.chapters);
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const q = query.trim().toLowerCase();
  const bookMatches = q.length > 0 && ['rich dad poor dad', 'robert t. kiyosaki', 'finance'].some(item => item.includes(q));
  const results = useMemo(() => {
    if (!q) return [];
    return chapters.filter(chapter => [chapter.title, chapter.subtitle, chapter.summary, ...chapter.tags].join(' ').toLowerCase().includes(q));
  }, [chapters, q]);

  const runSearch = (value: string) => {
    setQuery(value);
    const clean = value.trim();
    if (clean) {
      setRecentSearches(items => [clean, ...items.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 4));
    }
  };

  return (
    <Screen>
      <Text weight="serif" style={styles.title}>Search</Text>
      <View style={[styles.searchBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Ionicons name="search-outline" size={19} color={theme.colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => runSearch(query)}
          placeholder="Search books or topics"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text }]}
        />
      </View>

      <Text style={[styles.kicker, { color: theme.colors.muted }]}>TOPICS</Text>
      <View style={styles.chips}>
        {topics.map(topic => (
          <Pressable key={topic} onPress={() => runSearch(topic)} style={[styles.chip, { backgroundColor: theme.colors.cream, borderColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.primary }}>{topic}</Text>
          </Pressable>
        ))}
      </View>

      {recentSearches.length > 0 && (
        <>
          <Text style={[styles.kicker, { color: theme.colors.muted }]}>RECENT SEARCHES</Text>
          <View style={styles.recentList}>
            {recentSearches.map(item => (
              <Pressable key={item} onPress={() => setQuery(item)} style={styles.recentItem}>
                <Ionicons name="time-outline" size={16} color={theme.colors.muted} />
                <Text style={{ color: theme.colors.muted }}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {bookMatches && (
        <Pressable onPress={() => navigation.navigate('Chapters')} style={[styles.bookResult, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="book-outline" size={24} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text weight="serif" style={{ fontSize: 17 }}>Rich Dad Poor Dad</Text>
            <Text style={{ color: theme.colors.muted }}>Book • Offline available</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
        </Pressable>
      )}

      <View style={styles.results}>
        {results.map(chapter => <ChapterCard key={chapter._id} compact chapter={chapter} onPress={() => navigation.navigate('Reader', { chapterId: chapter._id })} />)}
        {q.length > 0 && !bookMatches && results.length === 0 && (
          <View style={[styles.empty, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons name="search-outline" size={28} color={theme.colors.muted} />
            <Text style={{ color: theme.colors.muted }}>No results found.</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, marginBottom: 18 },
  searchBox: { height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, height: 50, padding: 0 },
  kicker: { fontSize: 11, letterSpacing: 1.4, fontWeight: '700', marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 9 },
  recentList: { gap: 10, marginBottom: 22 },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bookResult: { borderWidth: 1, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  results: { marginTop: 4 },
  empty: { borderWidth: 1, borderRadius: 14, padding: 22, alignItems: 'center', gap: 8 }
});
