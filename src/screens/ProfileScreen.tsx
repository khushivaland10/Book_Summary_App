import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { ProgressRing } from '../components/ProgressRing';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/preferencesSlice';
import { darkTheme, lightTheme } from '../theme';

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(state => state.preferences.theme);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const user = useAppSelector(state => state.auth.user);
  const { chapters, bookmarks, notes, progress } = useAppSelector(state => state.library);
  const completed = Object.values(progress).filter(item => item.completed).length;
  const today = new Date().toDateString();
  const readToday = Object.values(progress).filter(item => item.completed && new Date(item.updatedAt).toDateString() === today).length;
  const streak = completed > 0 ? Math.max(1, readToday || 1) : 0;
  const minutes = chapters.filter(chapter => progress[chapter._id]?.completed).reduce((sum, chapter) => sum + chapter.minutes, 0);
  const percent = chapters.length ? completed / chapters.length : 0;

  return (
    <Screen>
      <View style={styles.header}>
        <Text weight="serif" style={styles.title}>Profile</Text>
        <Pressable onPress={() => dispatch(toggleTheme())} style={[styles.theme, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={18} color={theme.colors.primary} />
        </Pressable>
      </View>

      <View style={[styles.profile, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primarySoft }]}>
          <Ionicons name="person-outline" color={theme.colors.primary} size={26} />
        </View>
        <View style={{ flex: 1 }}>
          <Text weight="serif" style={{ fontSize: 18 }}>{user?.name || 'Reader'}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{user?.email}</Text>
        </View>
        <ProgressRing percent={percent} />
      </View>

      <View style={[styles.streak, { backgroundColor: theme.colors.cream, borderColor: theme.colors.border }]}>
        <Ionicons name="flame-outline" size={22} color={theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text weight="bold" style={{ color: theme.colors.primary }}>{streak} day streak</Text>
          <Text style={{ color: theme.colors.muted }}>You read {readToday} chapters today</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <Metric icon="book-outline" value={completed} label="Chapters Read" />
        <Metric icon="create-outline" value={notes.length} label="Notes Taken" />
        <Metric icon="bookmark-outline" value={bookmarks.length} label="Bookmarks" />
        <Metric icon="time-outline" value={minutes} label="Minutes Read" />
      </View>

      <View style={[styles.progress, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.row}>
          <Text weight="bold">Reading Progress</Text>
          <Text style={{ color: theme.colors.primary }}>{completed}/{chapters.length}</Text>
        </View>
        <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.fill, { width: `${percent * 100}%`, backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={{ color: theme.colors.muted }}>{chapters.length - completed} chapters remaining</Text>
      </View>

      <Pressable onPress={() => dispatch(logout())} style={[styles.signout, { borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.muted }}>Logout</Text>
      </Pressable>
    </Screen>
  );
}

function Metric({ icon, value, label }: { icon: string; value: number; label: string }) {
  const theme = useAppSelector(state => (state.preferences.theme === 'dark' ? darkTheme : lightTheme));
  return (
    <View style={[styles.metric, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Ionicons name={icon} color={theme.colors.primary} size={22} />
      <Text weight="serif" style={{ fontSize: 21, marginTop: 10 }}>{value}</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, marginBottom: 18 },
  theme: { width: 38, height: 38, borderWidth: 1, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  profile: { borderWidth: 1, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  avatar: { width: 54, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  streak: { borderWidth: 1, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: { width: '48%', borderWidth: 1, borderRadius: 14, padding: 16 },
  progress: { borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 8, borderRadius: 10, marginVertical: 10 },
  fill: { height: 8, borderRadius: 10 },
  signout: { borderWidth: 1, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 22 }
});
