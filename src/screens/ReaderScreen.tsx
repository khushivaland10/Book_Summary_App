import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { RootStackParamList } from '../navigation/types';
import { toggleBookmark, updateProgress, upsertNote } from '../redux/slices/librarySlice';
import { darkTheme, lightTheme } from '../theme';
import { API_ORIGIN } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

export function ReaderScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const { chapters, bookmarks, notes } = useAppSelector(state => state.library);
  const chapter = chapters.find(item => item._id === route.params.chapterId) || chapters[0];
  const bookmarked = bookmarks.some(item => item.chapterId === chapter._id);
  const existingNote = notes.find(note => note.chapterId === chapter._id)?.body || '';
  const [note, setNote] = useState(existingNote);
  const paragraphs = useMemo(() => chapter.summary.split('. ').filter(Boolean), [chapter.summary]);

  const playAudio = async () => {
    if (!chapter.audioUrl) {
      Alert.alert('Audio summary', 'Add an audio URL for this chapter in MongoDB or backend seed data.');
      return;
    }
    const audioUrl = chapter.audioUrl.startsWith('http') ? chapter.audioUrl : `${API_ORIGIN}${chapter.audioUrl}`;
    Sound.setCategory('Playback');
    const sound = new Sound(audioUrl, undefined, error => {
      if (error) {
        Alert.alert('Audio summary', 'Unable to load this audio summary.');
        return;
      }
      sound.play(() => sound.release());
    });
  };

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={theme.colors.text} /></Pressable>
        <Text style={{ color: theme.colors.muted }}>Chapter {chapter.chapterNumber}</Text>
        <View style={styles.actions}>
          <Pressable onPress={() => dispatch(toggleBookmark(chapter._id))}><Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={theme.colors.primary} /></Pressable>
          <Pressable onPress={() => dispatch(upsertNote({ chapterId: chapter._id, body: note }))}><Ionicons name="create-outline" size={22} color={theme.colors.muted} /></Pressable>
        </View>
      </View>

      <Ionicons name={chapter.icon} size={52} color={theme.colors.primary} />
      <Text style={styles.kicker}>CHAPTER {chapter.chapterNumber}</Text>
      <Text weight="serif" style={styles.title}>{chapter.title}</Text>
      <Text style={{ color: theme.colors.muted, marginBottom: 20 }}>{chapter.subtitle}</Text>

      <View style={[styles.audio, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.row}><Text weight="bold" style={{ color: theme.colors.primary }}>Audio Summary</Text><Text style={{ color: theme.colors.muted }}>2 min</Text></View>
        <Text style={{ color: theme.colors.muted, marginVertical: 12 }}>{chapter.audioSummary || chapter.summary.slice(0, 180)}</Text>
        <Pressable onPress={playAudio} style={[styles.listen, { backgroundColor: theme.colors.primary }]}>
          <Text weight="bold" style={{ color: '#fff' }}>Listen to Summary</Text>
        </Pressable>
      </View>

      <View style={[styles.takeaways, { backgroundColor: theme.colors.cream, borderColor: theme.colors.border }]}>
        <Text style={[styles.kicker, { color: theme.colors.primary }]}>KEY FINANCIAL LESSONS</Text>
        {chapter.financialLessons?.map((item, index) => <Text key={item} style={styles.takeaway}>{index + 1}. {item}</Text>)}
      </View>

      <Text weight="serif" style={styles.section}>Key Takeaways</Text>
      <View style={[styles.lessonBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {chapter.keyTakeaways.map((item, index) => <Text key={item} style={styles.takeaway}>{index + 1}. {item}</Text>)}
      </View>

      <Text weight="serif" style={styles.section}>Real-Life Examples</Text>
      <View style={[styles.lessonBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {chapter.examples?.map((item, index) => <Text key={item} style={styles.takeaway}>Example {index + 1}: {item}</Text>)}
      </View>

      <Text weight="serif" style={styles.section}>My Note</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        onBlur={() => dispatch(upsertNote({ chapterId: chapter._id, body: note }))}
        placeholder="Write a note for this chapter..."
        placeholderTextColor={theme.colors.muted}
        multiline
        style={[styles.note, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
      />

      <Text weight="serif" style={styles.section}>Full Summary</Text>
      {paragraphs.map((paragraph, index) => <Text key={index} style={styles.paragraph}>{paragraph.trim()}{paragraph.endsWith('.') ? '' : '.'}</Text>)}
      <Pressable onPress={() => dispatch(updateProgress({ chapterId: chapter._id, percent: 1 }))} style={[styles.complete, { borderColor: theme.colors.primary }]}>
        <Text weight="bold" style={{ color: theme.colors.primary }}>Mark Chapter Complete</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  actions: { flexDirection: 'row', gap: 20 },
  kicker: { fontSize: 11, letterSpacing: 1.4, color: '#8d7c73', fontWeight: '700', marginTop: 10 },
  title: { fontSize: 27, marginTop: 6 },
  audio: { borderWidth: 1, borderRadius: 13, padding: 16, marginBottom: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  listen: { height: 44, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  takeaways: { borderWidth: 1, borderRadius: 13, padding: 16, marginBottom: 20 },
  lessonBox: { borderWidth: 1, borderRadius: 13, padding: 16, marginBottom: 20 },
  takeaway: { marginTop: 12 },
  section: { fontSize: 18, marginBottom: 12 },
  note: { minHeight: 88, borderWidth: 1, borderRadius: 12, padding: 14, textAlignVertical: 'top', marginBottom: 20 },
  paragraph: { marginBottom: 14, fontSize: 15, lineHeight: 24 },
  complete: { borderWidth: 1, borderRadius: 12, alignItems: 'center', padding: 14, marginTop: 8 }
});
