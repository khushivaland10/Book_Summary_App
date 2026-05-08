import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { RootStackParamList } from '../navigation/types';
import { updateProgress } from '../redux/slices/librarySlice';
import { Chapter } from '../types';
import { darkTheme, lightTheme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Chapters'>;

export function ChaptersScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { chapters, progress } = useAppSelector(state => state.library);
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const [query, setQuery] = useState('');
  const done = Object.values(progress).filter(item => item.completed).length;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter(chapter => [chapter.title, chapter.subtitle, ...chapter.tags].join(' ').toLowerCase().includes(q));
  }, [chapters, query]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.back, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { color: theme.colors.muted }]}>RICH DAD POOR DAD</Text>
          <Text weight="serif" style={styles.title}>Chapters</Text>
        </View>
      </View>

      <View style={[styles.offline, { backgroundColor: theme.colors.cream, borderColor: theme.colors.border }]}>
        <View style={styles.row}>
          <Text weight="bold" style={{ color: theme.colors.primary }}>Downloaded</Text>
          <Text style={{ color: theme.colors.muted }}>{chapters.length} chapters • ~6 MB</Text>
        </View>
        <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.fill, { width: `${chapters.length ? (done / chapters.length) * 100 : 0}%`, backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={{ color: theme.colors.muted }}>{done}/{chapters.length} completed</Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search chapter"
        placeholderTextColor={theme.colors.muted}
        style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]}
      />

      {filtered.map(chapter => (
        <ChapterRow
          key={chapter._id}
          chapter={chapter}
          percent={progress[chapter._id]?.percent || 0}
          completed={Boolean(progress[chapter._id]?.completed)}
          onOpen={() => navigation.navigate('Reader', { chapterId: chapter._id })}
          onComplete={() => dispatch(updateProgress({ chapterId: chapter._id, percent: 1 }))}
        />
      ))}
    </Screen>
  );
}

function ChapterRow({ chapter, percent, completed, onOpen, onComplete }: { chapter: Chapter; percent: number; completed: boolean; onOpen: () => void; onComplete: () => void }) {
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const progressLabel = completed ? 'Completed' : `${Math.round(percent * 100)}% completed`;

  return (
    <Pressable onPress={onOpen} style={[styles.chapter, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.chapterIcon, { backgroundColor: theme.colors.primarySoft }]}>
        <Text weight="bold" style={{ color: theme.colors.primary }}>{chapter.chapterNumber}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text weight="serif" style={styles.chapterTitle}>{chapter.title}</Text>
        <Text style={{ color: theme.colors.muted, marginTop: 2 }}>{chapter.subtitle}</Text>
        <View style={[styles.smallTrack, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.smallFill, { width: `${Math.max(4, percent * 100)}%`, backgroundColor: completed ? theme.colors.success : theme.colors.primary }]} />
        </View>
        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{progressLabel}</Text>
      </View>
      <Pressable onPress={onComplete} style={[styles.check, { borderColor: completed ? theme.colors.success : theme.colors.border }]}>
        <Ionicons name={completed ? 'checkmark-circle' : 'checkmark-circle-outline'} size={22} color={completed ? theme.colors.success : theme.colors.muted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  back: { width: 38, height: 38, borderWidth: 1, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  title: { fontSize: 28, lineHeight: 34 },
  offline: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 7, borderRadius: 10, marginVertical: 12 },
  fill: { height: 7, borderRadius: 10 },
  input: { height: 50, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, marginBottom: 14 },
  chapter: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  chapterIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  chapterTitle: { fontSize: 16, lineHeight: 22 },
  smallTrack: { height: 5, borderRadius: 8, marginTop: 10, marginBottom: 6 },
  smallFill: { height: 5, borderRadius: 8 },
  check: { width: 36, height: 36, borderWidth: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }
});
