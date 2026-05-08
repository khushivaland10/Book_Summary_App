import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { offlineStore } from '../../services/offlineSync';
import { Bookmark, Chapter, Note, ProgressMap, RecentView } from '../../types';

type LibraryState = {
  chapters: Chapter[];
  bookmarks: Bookmark[];
  notes: Note[];
  progress: ProgressMap;
  recentViews: RecentView[];
  syncing: boolean;
};

const cached = offlineStore.load();
const initialState: LibraryState = { ...cached, syncing: false };

export const hydrateLibrary = createAsyncThunk('library/hydrate', async () => offlineStore.load());
export const syncLibrary = createAsyncThunk('library/sync', async () => offlineStore.sync());

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<string>) {
      const exists = state.bookmarks.some(item => item.chapterId === action.payload);
      state.bookmarks = exists
        ? state.bookmarks.filter(item => item.chapterId !== action.payload)
        : [...state.bookmarks, { chapterId: action.payload, createdAt: new Date().toISOString() }];
      offlineStore.saveBookmarks(state.bookmarks);
    },
    upsertNote(state, action: PayloadAction<{ chapterId: string; body: string }>) {
      const existing = state.notes.find(note => note.chapterId === action.payload.chapterId);
      if (existing) {
        existing.body = action.payload.body;
        existing.updatedAt = new Date().toISOString();
        existing.dirty = true;
      } else {
        state.notes.push({ id: Date.now().toString(), chapterId: action.payload.chapterId, body: action.payload.body, updatedAt: new Date().toISOString(), dirty: true });
      }
      offlineStore.saveNotes(state.notes);
    },
    updateProgress(state, action: PayloadAction<{ chapterId: string; percent: number }>) {
      state.progress[action.payload.chapterId] = {
        percent: action.payload.percent,
        completed: action.payload.percent >= 1,
        updatedAt: new Date().toISOString()
      };
      offlineStore.saveProgress(state.progress);
    },
    markChapterViewed(state, action: PayloadAction<string>) {
      const viewedAt = new Date().toISOString();
      state.recentViews = [
        { chapterId: action.payload, viewedAt },
        ...state.recentViews.filter(item => item.chapterId !== action.payload)
      ].slice(0, 6);

      const existing = state.progress[action.payload];
      if (!existing) {
        state.progress[action.payload] = { percent: 0.25, completed: false, updatedAt: viewedAt };
        offlineStore.saveProgress(state.progress);
      }

      offlineStore.saveRecentViews(state.recentViews);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateLibrary.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(syncLibrary.pending, state => {
        state.syncing = true;
      })
      .addCase(syncLibrary.fulfilled, (state, action) => {
        state.syncing = false;
        state.chapters = action.payload;
      })
      .addCase(syncLibrary.rejected, state => {
        state.syncing = false;
      });
  }
});

export const { toggleBookmark, upsertNote, updateProgress, markChapterViewed } = librarySlice.actions;
export default librarySlice.reducer;
