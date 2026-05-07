import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, register } from '../redux/slices/authSlice';
import { lightTheme } from '../theme';

export function AuthScreen() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const error = useAppSelector(state => state.auth.error);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('khushivaland286');
  const [email, setEmail] = useState('khushivaland3286@gmail.com');
  const [password, setPassword] = useState('password123');

  const submit = () => {
    if (mode === 'login') dispatch(login({ email, password }));
    else dispatch(register({ name, email, password }));
  };

  return (
    <Screen scroll={false} style={styles.root}>
      <View style={styles.bookIcon}><Text style={styles.bookIconText}>RD</Text></View>
      <Text style={styles.kicker}>BOOK SUMMARY</Text>
      <Text weight="serif" style={styles.title}>Rich Dad Poor Dad</Text>
      <Text style={styles.subtitle}>Premium offline finance lessons, summaries, notes, audio, and daily insights.</Text>

      {mode === 'register' && <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />}
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
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
  kicker: { fontSize: 11, letterSpacing: 1.6, color: '#8d7c73', fontWeight: '700' },
  title: { fontSize: 34, lineHeight: 38, marginTop: 6 },
  subtitle: { color: '#7b7169', marginTop: 10, marginBottom: 24 },
  input: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e6ddd5', paddingHorizontal: 16, marginBottom: 12, backgroundColor: '#fff' },
  button: { height: 52, borderRadius: 12, backgroundColor: lightTheme.colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff' },
  error: { color: '#b42318', marginBottom: 10 },
  switch: { textAlign: 'center', color: lightTheme.colors.primary, marginTop: 18 }
});
