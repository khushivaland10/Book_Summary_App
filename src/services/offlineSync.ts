import NetInfo from '@react-native-community/netinfo';
import { api } from './api';
import { getJson, setJson } from '../database/mmkv';
import { Bookmark, Chapter, Note, ProgressMap } from '../types';
import { seedChapters } from '../data/seed';

const keys = {
  chapters: 'library.chapters',
  bookmarks: 'library.bookmarks',
  notes: 'library.notes',
  progress: 'library.progress',
  lastSync: 'library.lastSync'
};

export const offlineStore = {
  load() {
    const cachedChapters = getJson<Chapter[]>(keys.chapters, seedChapters);
    const shouldUseSeed =
      cachedChapters.length < seedChapters.length ||
      cachedChapters.some(chapter => !chapter.audioSummary || !chapter.audioUrl || !chapter.financialLessons || !chapter.examples);

    if (shouldUseSeed) {
      setJson(keys.chapters, seedChapters);
    }

    return {
      chapters: shouldUseSeed ? seedChapters : cachedChapters,
      bookmarks: getJson<Bookmark[]>(keys.bookmarks, []),
      notes: getJson<Note[]>(keys.notes, []),
      progress: getJson<ProgressMap>(keys.progress, {})
    };
  },
  saveLibrary(chapters: Chapter[]) {
    setJson(keys.chapters, chapters);
    setJson(keys.lastSync, new Date().toISOString());
  },
  saveBookmarks(bookmarks: Bookmark[]) {
    setJson(keys.bookmarks, bookmarks);
  },
  saveNotes(notes: Note[]) {
    setJson(keys.notes, notes);
  },
  saveProgress(progress: ProgressMap) {
    setJson(keys.progress, progress);
  },
  async sync() {
    const net = await NetInfo.fetch();
    if (!net.isConnected) return this.load().chapters;

    const local = this.load();
    const [{ data: chapters }] = await Promise.all([
      api.get<Chapter[]>('/chapters'),
      api.post('/sync', {
        bookmarks: local.bookmarks,
        notes: local.notes.filter(note => note.dirty),
        progress: local.progress
      })
    ]);

    this.saveLibrary(chapters);
    this.saveNotes(local.notes.map(note => ({ ...note, dirty: false })));
    return chapters;
  }
};
