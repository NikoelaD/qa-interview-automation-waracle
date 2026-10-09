import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, TAGLINE } from '../theme';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation, route }: any) {
  const { login, isAuthed, user, logout } = useAuth();
  const next = route.params?.next;
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(''); setBusy(true);
    try {
      await login(email.trim(), password);
      navigation.navigate(next || 'Home');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Sign in failed.');
    } finally { setBusy(false); }
  };

  if (isAuthed) {
    return (
      <View style={styles.wrap}>
        <Logo variant="dark" width={150} />
             <Text style={styles.h1}>You're signed in</Text>
            <Text style={styles.meta}>Signed in as {user?.firstName} ({user?.email}).</Text>
            <TouchableOpacity style={styles.cta} testID="login_continue_button" onPress={() => navigation.navigate('Products')}>
              <Text style={styles.ctaText}>Continue Shopping</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} testID="login_logout_button" onPress={logout}>
              <Text style={styles.secondaryText}>Log out</Text>
            </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.white }} contentContainerStyle={styles.wrap}>
      <Logo variant="dark" width={150} />
      <Text style={styles.tag}>{TAGLINE}</Text>
      <Text style={styles.h1}>Sign in</Text>

      <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" testID="login_email_input" style={styles.input} placeholder="you@example.com" />
        <Text style={styles.label}>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry testID="login_password_input" style={styles.input} placeholder="Your password" />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={[styles.cta, busy && { opacity: 0.6 }]} testID="login_submit_button" onPress={submit} disabled={busy}>
          <Text style={styles.ctaText}>{busy ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} testID="login_create_account_button" onPress={() => navigation.navigate('Register', { next })}>
        <Text style={styles.linkMuted}>New here? </Text>
        <Text style={styles.link}>Create an account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 40, backgroundColor: colors.white, flexGrow: 1 },
  tag: { color: colors.muted, marginTop: 14 },
  h1: { fontSize: 26, fontWeight: '800', color: colors.obsidian, marginTop: 18, marginBottom: 8 },
  meta: { color: colors.muted, marginTop: 6 },
  label: { color: colors.obsidian, fontWeight: '600', marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.clayDark, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  error: { color: '#B42318', marginTop: 14 },
  cta: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  secondary: { paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  secondaryText: { color: colors.obsidian, fontWeight: '700' },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkMuted: { color: colors.muted },
  link: { color: colors.obsidian, fontWeight: '700', textDecorationLine: 'underline' },
});
