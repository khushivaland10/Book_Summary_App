import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../database/mmkv';

type PreferencesState = { theme: 'light' | 'dark' };

const initialState: PreferencesState = {
  theme: (storage.getString('preferences.theme') as 'light' | 'dark') || 'light'
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      storage.set('preferences.theme', state.theme);
    }
  }
});

export const { toggleTheme } = preferencesSlice.actions;
export default preferencesSlice.reducer;
