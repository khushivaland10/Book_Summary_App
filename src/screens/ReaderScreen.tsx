import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { RootStackParamList } from '../navigation/types';
import { markChapterViewed, toggleBookmark, updateProgress, upsertNote } from '../redux/slices/librarySlice';
import { darkTheme, lightTheme } from '../theme';
import { API_ORIGIN } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;
type ReaderTab = 'Summary' | 'Lessons' | 'Notes' | 'Audio';

const chapterAudio: Record<number, number> = {
  1: require('../assets/audio/chapter-1.wav'),
  2: require('../assets/audio/chapter-2.wav'),
  3: require('../assets/audio/chapter-3.wav'),
  4: require('../assets/audio/chapter-4.wav'),
  5: require('../assets/audio/chapter-5.wav'),
  6: require('../assets/audio/chapter-6.wav'),
  7: require('../assets/audio/chapter-7.wav'),
  8: require('../assets/audio/chapter-8.wav'),
  9: require('../assets/audio/chapter-9.wav'),
  10: require('../assets/audio/chapter-10.wav')
};

const tabs: ReaderTab[] = ['Summary', 'Lessons', 'Notes', 'Audio'];

export function ReaderScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  const { chapters, bookmarks, notes, progress } = useAppSelector(state => state.library);
  const chapter = chapters.find(item => item._id === route.params.chapterId) || chapters[0];
  const bookmarked = bookmarks.some(item => item.chapterId === chapter._id);
  const existingNote = notes.find(note => note.chapterId === chapter._id)?.body || '';
  const chapterProgress = progress[chapter._id]?.percent || 0;
  const [tab, setTab] = useState<ReaderTab>('Summary');
  const [note, setNote] = useState(existingNote);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const soundRef = useRef<Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const paragraphs = useMemo(() => chapter.summary.split('. ').filter(Boolean), [chapter.summary]);

  useEffect(() => {
    dispatch(markChapterViewed(chapter._id));
    setNote(existingNote);
    return () => {
      stopAudioTimer();
      soundRef.current?.release();
      soundRef.current = null;
    };
  }, [chapter._id, dispatch, existingNote]);

  const stopAudioTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAudioTimer = (sound: Sound) => {
    stopAudioTimer();
    timerRef.current = setInterval(() => {
      sound.getCurrentTime(seconds => {
        const duration = sound.getDuration();
        setAudioProgress(duration ? seconds / duration : 0);
      });
    }, 500);
  };

  const playLoadedSound = (sound: Sound) => {
    startAudioTimer(sound);
    sound.play(success => {
      stopAudioTimer();
      setAudioPlaying(false);
      if (success) {
        sound.setCurrentTime(0);
        setAudioProgress(0);
      } else {
        Alert.alert('Audio summary', 'Audio playback stopped unexpectedly.');
      }
    });
  };

  const handleAudioLoaded = (sound: Sound, error: unknown, fallbackMessage: string) => {
    setAudioLoading(false);
    if (error) {
      Alert.alert('Audio summary', fallbackMessage);
      return;
    }
    soundRef.current = sound;
    setAudioPlaying(true);
    playLoadedSound(sound);
  };

  const playAudio = () => {
    Sound.setCategory('Playback');

    if (soundRef.current) {
      if (audioPlaying) {
        soundRef.current.pause(() => {
          stopAudioTimer();
          setAudioPlaying(false);
        });
      } else {
        setAudioPlaying(true);
        playLoadedSound(soundRef.current);
      }
      return;
    }

    const localAudio = chapterAudio[chapter.chapterNumber];
    const audioSource = localAudio || (chapter.audioUrl?.startsWith('http') ? chapter.audioUrl : chapter.audioUrl ? `${API_ORIGIN}${chapter.audioUrl}` : undefined);

    if (!audioSource) {
      Alert.alert('Audio summary', 'Audio is not available for this chapter yet.');
      return;
    }

    setAudioLoading(true);
    let sound: Sound;
    if (typeof audioSource === 'number') {
      sound = new Sound(audioSource, error => handleAudioLoaded(sound, error, 'Unable to load the offline audio summary.'));
    } else {
      sound = new Sound(audioSource, undefined, error => handleAudioLoaded(sound, error, 'Unable to load audio right now. You can still read the saved summary below.'));
    }
  };

  const markComplete = () => dispatch(updateProgress({ chapterId: chapter._id, percent: 1 }));

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={theme.colors.text} /></Pressable>
        <Text style={{ color: theme.colors.muted }}>Chapter {chapter.chapterNumber}</Text>
        <Pressable onPress={() => dispatch(toggleBookmark(chapter._id))}>
          <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={23} color={theme.colors.primary} />
        </Pressable>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Ionicons name={chapter.icon} size={34} color={theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { color: theme.colors.muted }]}>CHAPTER {chapter.chapterNumber}</Text>
          <Text weight="serif" style={styles.title}>{chapter.title}</Text>
          <Text style={{ color: theme.colors.muted }}>{chapter.subtitle}</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={{ color: theme.colors.muted }}>Chapter progress</Text>
        <Text weight="bold" style={{ color: theme.colors.primary }}>{Math.round(chapterProgress * 100)}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.fill, { width: `${Math.max(4, chapterProgress * 100)}%`, backgroundColor: theme.colors.primary }]} />
      </View>

      <View style={[styles.tabs, { backgroundColor: theme.colors.cream }]}>
        {tabs.map(item => (
          <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && { backgroundColor: theme.colors.card }]}>
            <Text weight="bold" style={{ color: tab === item ? theme.colors.primary : theme.colors.muted }}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'Summary' && (
        <>
          <Section title="Summary">
            <Text style={styles.paragraph}>{chapter.audioSummary || chapter.summary}</Text>
          </Section>
          <Section title="Full Summary">
            {paragraphs.map((paragraph, index) => <Text key={index} style={styles.paragraph}>{paragraph.trim()}{paragraph.endsWith('.') ? '' : '.'}</Text>)}
          </Section>
        </>
      )}

      {tab === 'Lessons' && (
        <>
          <Section title="Key Financial Lessons">
            {chapter.financialLessons.map((item, index) => <Bullet key={item} index={index + 1} text={item} />)}
          </Section>
          <Section title="Key Takeaways">
            {chapter.keyTakeaways.map((item, index) => <Bullet key={item} index={index + 1} text={item} />)}
          </Section>
          <Section title="Real-Life Examples">
            {chapter.examples.map((item, index) => <Bullet key={item} index={index + 1} text={item} prefix="Example" />)}
          </Section>
        </>
      )}

      {tab === 'Notes' && (
        <Section title="My Notes">
          <TextInput
            value={note}
            onChangeText={setNote}
            onBlur={() => dispatch(upsertNote({ chapterId: chapter._id, body: note }))}
            placeholder="Write a note for this chapter..."
            placeholderTextColor={theme.colors.muted}
            multiline
            style={[styles.note, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.bg }]}
          />
          <Pressable onPress={() => dispatch(upsertNote({ chapterId: chapter._id, body: note }))} style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}>
            <Text weight="bold" style={{ color: '#fff' }}>Save Note</Text>
          </Pressable>
        </Section>
      )}

      {tab === 'Audio' && (
        <Section title="Audio Summary">
          <Text style={styles.paragraph}>{chapter.audioSummary || chapter.summary}</Text>
          <Pressable disabled={audioLoading} onPress={playAudio} style={[styles.primaryButton, { backgroundColor: theme.colors.primary, opacity: audioLoading ? 0.7 : 1 }]}>
            <Ionicons name={audioPlaying ? 'pause' : 'play'} size={18} color="#fff" />
            <Text weight="bold" style={{ color: '#fff' }}>{audioLoading ? 'Loading Audio...' : audioPlaying ? 'Pause Audio' : 'Play Audio'}</Text>
          </Pressable>
        </Section>
      )}

      <Pressable onPress={markComplete} style={[styles.complete, { borderColor: theme.colors.primary }]}>
        <Text weight="bold" style={{ color: theme.colors.primary }}>Mark Chapter Complete</Text>
      </Pressable>

      {(audioPlaying || audioProgress > 0) && (
        <View style={[styles.miniPlayer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Pressable onPress={playAudio} style={[styles.miniButton, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name={audioPlaying ? 'pause' : 'play'} size={17} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text weight="bold">Audio Summary</Text>
            <View style={[styles.miniTrack, { backgroundColor: theme.colors.border }]}>
              <View style={[styles.miniFill, { width: `${audioProgress * 100}%`, backgroundColor: theme.colors.primary }]} />
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  return (
    <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text weight="serif" style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ index, text, prefix }: { index: number; text: string; prefix?: string }) {
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  return (
    <View style={styles.bullet}>
      <Text weight="bold" style={{ color: theme.colors.primary }}>{prefix ? `${prefix} ${index}` : index}</Text>
      <Text style={[styles.bulletText, { color: theme.colors.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  hero: { borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: 'row', gap: 14, marginBottom: 14 },
  kicker: { fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  title: { fontSize: 24, lineHeight: 31, marginTop: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  track: { height: 7, borderRadius: 10, marginBottom: 16 },
  fill: { height: 7, borderRadius: 10 },
  tabs: { flexDirection: 'row', borderRadius: 14, padding: 4, marginBottom: 14 },
  tab: { flex: 1, minHeight: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  section: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  paragraph: { marginBottom: 12, fontSize: 15, lineHeight: 24 },
  bullet: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  bulletText: { flex: 1, lineHeight: 22 },
  note: { minHeight: 150, borderWidth: 1, borderRadius: 12, padding: 14, textAlignVertical: 'top', marginBottom: 12 },
  primaryButton: { minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  complete: { borderWidth: 1, borderRadius: 12, alignItems: 'center', padding: 14, marginTop: 2, marginBottom: 12 },
  miniPlayer: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  miniButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  miniTrack: { height: 5, borderRadius: 8, marginTop: 8 },
  miniFill: { height: 5, borderRadius: 8 }
});
