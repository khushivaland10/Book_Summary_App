import axios from 'axios';
import { Platform } from 'react-native';
import { storage } from '../database/mmkv';

const LOCAL_API_HOST = Platform.select({
  android: '10.0.2.2',
  ios: 'localhost',
  default: 'localhost'
});

export const API_ORIGIN = `http://${LOCAL_API_HOST}:4000`;
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000
});

api.interceptors.request.use(config => {
  const token = storage.getString('auth.token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
