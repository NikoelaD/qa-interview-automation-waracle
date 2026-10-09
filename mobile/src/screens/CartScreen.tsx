import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateTotals } from '../services/pricing';

export default function CartScreen({ navigation }: any) {
  const { lines, remove, subtotal, coupon, setCoupon } = useCart();
  const { isAuthed } = useAuth();
  const [code, setCode] = useState(coupon || '');
  const [note, setNote] = useState('');

  const totals = calculateTotals(subtotal, coupon);

  const apply = () => {
    const entered = code.trim();
    setCoupon(entered || undefined);
    const applied = calculateTotals(subtotal, entered || undefined);
    setNote(applied.discount > 0 ? `Coupon applied: -£${applied.discount.toFixed(2)}` : 'That coupon is not valid.');
  };

  if (lines.length === 0) {
    return (
             <View style={styles.empty}>
               <Text style={styles.emptyText}>Your cart is empty.</Text>
               <TouchableOpacity style={styles.cta} testID="cart_start_shopping_button" onPress={() => navigation.navigate('Products')}>
                 <Text style={styles.ctaText}>Start Shopping</Text>
               </TouchableOpacity>
             </View>
    );
  }

  const proceed = () => {
    if (isAuthed) navigation.navigate('Checkout', { couponCode: coupon });
    else navigation.navigate('Login', { next: 'Checkout' });
  };

  return (
    <ScrollView style={{ backgroundColor: colors.white }} contentContainerStyle={{ padding: 16 }}>
      {lines.map((l) => (
        <View key={l.product.id + l.size} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{l.product.name}</Text>
            <Text style={styles.meta}>Size {l.size} · Qty {l.quantity}</Text>
          </View>
          <Text style={styles.lineTotal}>£{(l.product.price * l.quantity).toFixed(2)}</Text>
               <TouchableOpacity testID={`cart_remove_button_${l.product.id}_${l.size}`} onPress={() => remove(l.product.id, l.size)}>
                 <Text style={styles.remove}>Remove</Text>
               </TouchableOpacity>
        </View>
      ))}

      <View style={styles.couponRow}>
           <TextInput value={code} onChangeText={setCode} placeholder="Coupon code (try WARACLE25)" autoCapitalize="characters" testID="cart_coupon_input" style={styles.input} />
           <TouchableOpacity style={styles.applyBtn} testID="cart_apply_button" onPress={apply}>
             <Text style={styles.applyText}>Apply</Text>
           </TouchableOpacity>
      </View>
      {!!note && <Text style={styles.note}>{note}</Text>}

      <View style={styles.summary}>
        <Line label="Subtotal" value={totals.subtotal} />
        {totals.discount > 0 && <Line label={`Discount (${coupon})`} value={-totals.discount} />}
        <Line label="Shipping" value={totals.shipping} />
        <View style={styles.divider} />
        <Line label="Total" value={totals.total} bold />
      </View>

         <TouchableOpacity style={styles.cta} testID="cart_proceed_button" onPress={proceed}>
           <Text style={styles.ctaText}>Proceed to Checkout</Text>
         </TouchableOpacity>
      {!isAuthed && <Text style={styles.hint}>You'll be asked to sign in or create an account before placing your order.</Text>}
    </ScrollView>
  );
}

function Line({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <View style={styles.sumLine}>
      <Text style={[styles.sumLabel, bold && styles.boldT]}>{label}</Text>
      <Text style={[styles.sumValue, bold && styles.boldT]}>{value < 0 ? '-' : ''}£{Math.abs(value).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, padding: 24 },
  emptyText: { color: colors.muted, fontSize: 16, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.clay },
  name: { color: colors.obsidian, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 13, marginTop: 2 },
  lineTotal: { color: colors.obsidian, fontWeight: '700' },
  remove: { color: colors.muted, fontSize: 12, textDecorationLine: 'underline' },
  couponRow: { flexDirection: 'row', gap: 8, marginTop: 18 },
  input: { flex: 1, borderWidth: 1, borderColor: colors.clayDark, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  applyBtn: { backgroundColor: colors.obsidian, paddingHorizontal: 18, justifyContent: 'center', borderRadius: 10 },
  applyText: { color: colors.white, fontWeight: '700' },
  note: { color: colors.muted, marginTop: 8 },
  summary: { marginTop: 20, backgroundColor: colors.clay, borderRadius: 14, padding: 16 },
  sumLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  sumLabel: { color: colors.muted },
  sumValue: { color: colors.obsidian },
  boldT: { fontWeight: '800', color: colors.obsidian, fontSize: 16 },
  divider: { height: 1, backgroundColor: colors.clayDark, marginVertical: 8 },
  cta: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  hint: { color: colors.muted, fontSize: 12, marginTop: 10, textAlign: 'center' },
});
