import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { ChapterCard } from '../components/ChapterCard';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { darkTheme, lightTheme } from '../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Saved'>, NativeStackScreenProps<RootStackParamList>>;

export function SavedScreen({ navigation }: Props) {
  const [tab, setTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const { chapters, bookmarks, notes } = useAppSelector(state => state.library);
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const saved = useMemo(() => chapters.filter(chapter => bookmarks.some(bookmark => bookmark.chapterId === chapter._id)), [chapters, bookmarks]);

  return (
    <Screen scroll={false}>
      <Text weight="serif" style={styles.title}>Saved</Text>
      <View style={[styles.segment, { backgroundColor: theme.colors.border }]}>
        {(['bookmarks', 'notes'] as const).map(item => (
          <Pressable key={item} onPress={() => setTab(item)} style={[styles.segmentButton, tab === item && { backgroundColor: theme.colors.card }]}>
            <Text weight="bold">{item === 'bookmarks' ? 'Bookmarks' : 'My Notes'}</Text>
          </Pressable>
        ))}
      </View>
      {tab === 'bookmarks' && saved.length > 0 && saved.map(chapter => <ChapterCard key={chapter._id} compact chapter={chapter} onPress={() => navigation.navigate('Reader', { chapterId: chapter._id })} />)}
      {tab === 'notes' && notes.map(note => {
        const chapter = chapters.find(item => item._id === note.chapterId);
        return (
          <Pressable key={note.id} style={[styles.note, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => chapter && navigation.navigate('Reader', { chapterId: chapter._id })}>
            <Text weight="serif">{chapter?.title}</Text>
            <Text style={{ color: theme.colors.muted }}>{note.body}</Text>
          </Pressable>
        );
      })}
      {((tab === 'bookmarks' && saved.length === 0) || (tab === 'notes' && notes.length === 0)) && (
        <View style={styles.empty}>
          <Ionicons name={tab === 'bookmarks' ? 'bookmark-outline' : 'create-outline'} size={44} color={theme.colors.border} />
          <Text style={{ color: theme.colors.muted }}>{tab === 'bookmarks' ? 'No bookmarks yet' : 'No notes yet'}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Tap the icon while reading</Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 27, marginBottom: 18 },
  segment: { height: 42, borderRadius: 13, flexDirection: 'row', padding: 4, marginBottom: 28 },
  segmentButton: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  note: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 }
});
