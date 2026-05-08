import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, register } from '../redux/slices/authSlice';
import { darkTheme, lightTheme } from '../theme';

export function AuthScreen() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const error = useAppSelector(state => state.auth.error);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('khushivaland286');
  const [email, setEmail] = useState('khushivaland3286@gmail.com');
  const [password, setPassword] = useState('password123');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  const submit = () => {
    if (mode === 'login') dispatch(login({ email, password }));
    else dispatch(register({ name, email, password }));
  };

  return (
    <Screen scroll={false} style={styles.root}>
      <View style={styles.bookIcon}><Ionicons name="book-outline" size={30} color="#fff" /></View>
      <Text style={styles.appName}>BookSummary</Text>
      <Text style={styles.tagline}>
        Read smarter. Learn faster.
      </Text>

      {mode === 'register' && <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />}
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={styles.input} />
      <View style={styles.passwordWrap}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#7b7169"
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
        />
        <Pressable onPress={() => setPasswordVisible(value => !value)} style={styles.eyeButton}>
          <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={21} color="#7b7169" />
        </Pressable>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable disabled={loading} onPress={submit} style={[styles.button, loading && styles.buttonDisabled]}>
        <Text weight="bold" style={styles.buttonText}>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={styles.switch}>{mode === 'login' ? 'Create a new account' : 'I already have an account'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { justifyContent: 'center' },
  bookIcon: { width: 64, height: 64, borderRadius: 14, backgroundColor: lightTheme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  bookIconText: { color: '#fff', fontSize: 28 },
  appName: { fontSize: 34, lineHeight: 38, fontWeight: '700', color: '#101828' },
  tagline: { color: '#7b7169', marginTop: 10, marginBottom: 24 },
  input: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e6ddd5', paddingHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', color: '#101828' },
  passwordWrap: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e6ddd5', marginBottom: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, height: 50, paddingHorizontal: 16, color: '#101828' },
  eyeButton: { width: 48, height: 50, alignItems: 'center', justifyContent: 'center' },
  button: { height: 52, borderRadius: 12, backgroundColor: lightTheme.colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff' },
  error: { color: '#b42318', marginBottom: 10 },
  switch: { textAlign: 'center', color: lightTheme.colors.primary, marginTop: 18 }
});
