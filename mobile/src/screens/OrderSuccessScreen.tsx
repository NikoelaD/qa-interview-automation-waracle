import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function OrderSuccessScreen({ navigation, route }: any) {
  const { orderNumber, total } = route.params || {};
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}><Text style={styles.tick}>✓</Text></View>
      <Text style={styles.h1}>Order confirmed</Text>
      <Text style={styles.meta}>Thank you. Your order has been placed.</Text>
      <View style={styles.card}>
        <Row label="Order number" value={orderNumber} />
        <Row label="Total paid" value={`£${Number(total || 0).toFixed(2)}`} />
      </View>
         <TouchableOpacity style={styles.cta} testID="order_success_continue_button" onPress={() => navigation.navigate('Products')}>
           <Text style={styles.ctaText}>Continue Shopping</Text>
         </TouchableOpacity>
    </View>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.white, padding: 24, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  tick: { color: colors.white, fontSize: 38, fontWeight: '800' },
  h1: { fontSize: 26, fontWeight: '800', color: colors.obsidian, marginTop: 20 },
  meta: { color: colors.muted, marginTop: 8, textAlign: 'center' },
  card: { alignSelf: 'stretch', backgroundColor: colors.clay, borderRadius: 14, padding: 18, marginTop: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: colors.muted },
  rowValue: { color: colors.obsidian, fontWeight: '700' },
  cta: { alignSelf: 'stretch', backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 28 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
