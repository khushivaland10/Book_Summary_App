import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../../services/api';
import { storage } from '../../database/mmkv';

type User = { id: string; name: string; email: string };
type AuthState = { user: User | null; token: string | null; loading: boolean; error?: string };

const initialState: AuthState = { user: null, token: null, loading: false };
const demoCredentials = {
  email: 'khushivaland3286@gmail.com',
  password: 'password123',
  user: {
    id: 'demo-user',
    name: 'khushivaland286',
    email: 'khushivaland3286@gmail.com'
  }
};

function persistAuth(token: string, user: User) {
  storage.set('auth.token', token);
  storage.set('auth.user', JSON.stringify(user));
}

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const token = storage.getString('auth.token') || null;
  const user = storage.getString('auth.user');
  return { token, user: user ? (JSON.parse(user) as User) : null };
});

function getAuthError(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || 'Unable to sign in. Please try again.';
  }
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: string }).message);
  }
  return 'Unable to sign in. Please try again.';
}

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    persistAuth(data.token, data.user);
    return data as { token: string; user: User };
  } catch (error) {
    const isDemoLogin = payload.email.trim().toLowerCase() === demoCredentials.email && payload.password === demoCredentials.password;
    const isNetworkError = axios.isAxiosError(error) && !error.response;
    if (isDemoLogin && isNetworkError) {
      const token = `offline-demo-${Date.now()}`;
      persistAuth(token, demoCredentials.user);
      return { token, user: demoCredentials.user };
    }
    return rejectWithValue(getAuthError(error));
  }
});

export const register = createAsyncThunk('auth/register', async (payload: { name: string; email: string; password: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    persistAuth(data.token, data.user);
    return data as { token: string; user: User };
  } catch (error) {
    return rejectWithValue(getAuthError(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      storage.delete('auth.token');
      storage.delete('auth.user');
    }
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message;
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
