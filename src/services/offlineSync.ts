import { getJson, setJson } from '../database/mmkv';
import { Bookmark, Chapter, Note, ProgressMap, RecentView } from '../types';
import { seedChapters } from '../data/seed';

const keys = {
  chapters: 'library.chapters',
  bookmarks: 'library.bookmarks',
  notes: 'library.notes',
  progress: 'library.progress',
  recentViews: 'library.recentViews',
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
      progress: getJson<ProgressMap>(keys.progress, {}),
      recentViews: getJson<RecentView[]>(keys.recentViews, [])
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
  saveRecentViews(recentViews: RecentView[]) {
    setJson(keys.recentViews, recentViews);
  },
  async sync() {
    // Standalone offline app - no backend sync needed
    // Just return locally stored chapters
    return this.load().chapters;
  }
};
