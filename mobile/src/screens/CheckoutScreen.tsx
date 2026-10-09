import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { colors } from '../theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateTotals } from '../services/pricing';
import { apiCreateOrder } from '../api';

export default function CheckoutScreen({ navigation, route }: any) {
  const couponCode: string | undefined = route.params?.couponCode;
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();
  const totals = calculateTotals(subtotal, couponCode);

  // Shipping
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}`.trim() : '');
  const [emailAddr, setEmailAddr] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  // Payment (validated locally; never transmitted or stored)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = () => {
    if (!name || !emailAddr || !address || !city || !postcode) return 'Please complete your name and full shipping address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddr)) return 'Please enter a valid email address.';
    if (!cardName.trim()) return 'Please enter the name on the card.';
    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d{12,19}$/.test(digits)) return 'Please enter a valid card number (12 to 19 digits).';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Please enter the card expiry as MM/YY.';
    const [mm] = expiry.split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Card expiry month must be between 01 and 12.';
    if (!/^\d{3,4}$/.test(cvc)) return 'Please enter a valid CVC.';
    return '';
  };

  const placeOrder = async () => {
    const msg = validate();
    if (msg) { setError(msg); Alert.alert('Please check your details', msg); return; }
    setError(''); setBusy(true);
    try {
      const body = {
        items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity, size: l.size })),
        couponCode,
        customer: { name, email: emailAddr },
        shipping: { address, city, postcode },
        payment: { last4: cardNumber.replace(/\s/g, '').slice(-4), method: 'card' },
        _total: totals.total,
      };
      const order = await apiCreateOrder(body);
      clear();
      navigation.navigate('OrderSuccess', { orderNumber: order.orderNumber, total: order.total });
    } catch (e: any) {
      const m = e?.response?.data?.message || e?.message || 'Could not place the order.';
      setError(m);
      Alert.alert('Order could not be placed', m);
    } finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator
      >
          <Text style={styles.h2}>Shipping details</Text>
          <Field label="Full name" value={name} onChange={setName} placeholder="John Doe" testID="checkout_name_input" />
          <Field label="Email" value={emailAddr} onChange={setEmailAddr} placeholder="you@example.com" keyboard="email-address" testID="checkout_email_input" />
          <Field label="Address" value={address} onChange={setAddress} placeholder="1 Example Street" testID="checkout_address_input" />
          <Field label="City" value={city} onChange={setCity} placeholder="Glasgow" testID="checkout_city_input" />
          <Field label="Postcode" value={postcode} onChange={setPostcode} placeholder="G1 1AA" testID="checkout_postcode_input" />

          <Text style={[styles.h2, { marginTop: 22 }]}>Payment details</Text>
          <Field label="Name on card" value={cardName} onChange={setCardName} placeholder="John Doe" testID="checkout_cardname_input" />
          <Field label="Card number" value={cardNumber} onChange={(v: string) => setCardNumber(formatCard(v))} placeholder="4242 4242 4242 4242" keyboard="number-pad" testID="checkout_cardnumber_input" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field label="Expiry (MM/YY)" value={expiry} onChange={(v: string) => setExpiry(formatExpiry(v))} placeholder="12/28" keyboard="number-pad" testID="checkout_expiry_input" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="CVC" value={cvc} onChange={(v: string) => setCvc(v.replace(/\D/g, '').slice(0, 4))} placeholder="123" keyboard="number-pad" secure testID="checkout_cvc_input" />
            </View>
          </View>
        <Text style={styles.secure}>Demo only — card details are checked on your device and are not sent or stored.</Text>

        <View style={styles.summary}>
          <Line label="Subtotal" value={totals.subtotal} />
          {totals.discount > 0 && <Line label={`Discount (${couponCode})`} value={-totals.discount} />}
          <Line label="Shipping" value={totals.shipping} />
          <View style={styles.divider} />
          <Line label="Total" value={totals.total} bold />
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      {/* Pinned footer so the pay button is always reachable */}
      <View style={styles.footer}>
          {!!error && <Text style={styles.footerError}>{error}</Text>}
          <TouchableOpacity style={[styles.cta, busy && { opacity: 0.6 }]} testID="checkout_pay_button" onPress={placeOrder} disabled={busy}>
            <Text style={styles.ctaText}>{busy ? 'Placing order...' : `Pay & Place Order   ·   £${totals.total.toFixed(2)}`}</Text>
          </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChange, placeholder, keyboard, secure, testID }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        testID={testID}
        keyboardType={keyboard || 'default'}
        secureTextEntry={!!secure}
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
        style={styles.input}
      />
    </View>
  );
}
function Line({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <View style={styles.sumLine}>
      <Text style={[styles.sumLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.sumValue, bold && styles.bold]}>{value < 0 ? '-' : ''}£{Math.abs(value).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  h2: { fontSize: 20, fontWeight: '800', color: colors.obsidian, marginBottom: 8 },
  label: { color: colors.obsidian, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.clayDark, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  secure: { color: colors.muted, fontSize: 12, marginTop: 10 },
  summary: { marginTop: 20, backgroundColor: colors.clay, borderRadius: 14, padding: 16 },
  sumLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  sumLabel: { color: colors.muted },
  sumValue: { color: colors.obsidian },
  bold: { fontWeight: '800', color: colors.obsidian, fontSize: 16 },
  divider: { height: 1, backgroundColor: colors.clayDark, marginVertical: 8 },
  error: { color: '#B42318', marginTop: 14 },
  footer: { padding: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.clay, backgroundColor: colors.white },
  footerError: { color: '#B42318', marginBottom: 8, fontSize: 13 },
  cta: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
