import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation, route }: any) {
  const { register } = useAuth();
  const next = route.params?.next;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    if (!firstName || !lastName || !email || !password) { setError('Please complete every field.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setBusy(true);
    try {
      await register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password });
      navigation.navigate(next || 'Home');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Could not create the account.');
    } finally { setBusy(false); }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.white }} contentContainerStyle={styles.wrap}>
      <Logo variant="dark" width={150} />
      <Text style={styles.h1}>Create your account</Text>

         <Text style={styles.label}>First name</Text>
         <TextInput value={firstName} onChangeText={setFirstName} testID="register_firstname_input" style={styles.input} placeholder="John" />
         <Text style={styles.label}>Last name</Text>
         <TextInput value={lastName} onChangeText={setLastName} testID="register_lastname_input" style={styles.input} placeholder="Doe" />
         <Text style={styles.label}>Email</Text>
         <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" testID="register_email_input" style={styles.input} placeholder="you@example.com" />
         <Text style={styles.label}>Password</Text>
         <TextInput value={password} onChangeText={setPassword} secureTextEntry testID="register_password_input" style={styles.input} placeholder="At least 8 characters" />

         {!!error && <Text style={styles.error}>{error}</Text>}

         <TouchableOpacity style={[styles.cta, busy && { opacity: 0.6 }]} testID="register_submit_button" onPress={submit} disabled={busy}>
           <Text style={styles.ctaText}>{busy ? 'Creating...' : 'Create Account'}</Text>
         </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} testID="register_signin_button" onPress={() => navigation.navigate('Login', { next })}>
        <Text style={styles.linkMuted}>Already have an account? </Text>
        <Text style={styles.link}>Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 40, backgroundColor: colors.white, flexGrow: 1 },
  h1: { fontSize: 26, fontWeight: '800', color: colors.obsidian, marginTop: 18, marginBottom: 4 },
  label: { color: colors.obsidian, fontWeight: '600', marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.clayDark, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  error: { color: '#B42318', marginTop: 14 },
  cta: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkMuted: { color: colors.muted },
  link: { color: colors.obsidian, fontWeight: '700', textDecorationLine: 'underline' },
});
