import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
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
const topics = ['Assets', 'Liabilities', 'Invest', 'Money', 'Fear', 'Rich', 'Tax', 'Mindset'];

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const chapters = useAppSelector(state => state.library.chapters);
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return chapters.filter(ch => [ch.title, ch.subtitle, ch.summary, ...ch.tags].join(' ').toLowerCase().includes(q));
  }, [chapters, query]);

  return (
    <Screen>
      <Text weight="serif" style={styles.title}>Search</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search chapters, lessons, quotes..." placeholderTextColor={theme.colors.muted} style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} />
      <Text style={styles.kicker}>EXPLORE TOPICS</Text>
      <View style={styles.chips}>
        {topics.map(topic => (
          <Pressable key={topic} onPress={() => setQuery(topic)} style={[styles.chip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text>{topic}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.results}>{results.map(chapter => <ChapterCard key={chapter._id} compact chapter={chapter} onPress={() => navigation.navigate('Reader', { chapterId: chapter._id })} />)}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 27, marginBottom: 18 },
  input: { height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 18, marginBottom: 20 },
  kicker: { fontSize: 11, letterSpacing: 1.4, color: '#8d7c73', fontWeight: '700', marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 9 },
  results: { marginTop: 24 }
});
