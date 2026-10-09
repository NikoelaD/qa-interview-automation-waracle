import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import ProductArt from '../components/ProductArt';
import { fetchProduct } from '../api';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [product, setProduct] = useState<Product | undefined>();
  const [size, setSize] = useState<string>('');
  const { add } = useCart();

  useEffect(() => { fetchProduct(id).then((p) => { setProduct(p); setSize(p?.sizes[0] || ''); }); }, [id]);

  if (!product) return <ActivityIndicator style={{ marginTop: 40 }} color={colors.obsidian} />;

  return (
    <ScrollView style={{ backgroundColor: colors.white }} contentContainerStyle={{ padding: 16 }}>
      <ProductArt image={product.image} height={260} />
      <Text style={styles.cat}>{product.category.toUpperCase()}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
      <Text style={styles.desc}>{product.description}</Text>

      <Text style={styles.label}>Size</Text>
      <View style={styles.sizes}>
        {product.sizes.map((s) => (
              <TouchableOpacity key={s} testID={`product_detail_size_selector_${s}`} onPress={() => setSize(s)} style={[styles.size, size === s && styles.sizeOn]}>
                <Text style={[styles.sizeText, size === s && styles.sizeTextOn]}>{s}</Text>
              </TouchableOpacity>
        ))}
      </View>

        <TouchableOpacity style={styles.cta} testID="product_detail_add_button" onPress={() => { add(product, size); navigation.navigate('Cart'); }}>
          <Text style={styles.ctaText}>Add to Cart</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cat: { color: 'rgba(11,18,21,0.4)', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 16 },
  name: { color: colors.obsidian, fontSize: 22, fontWeight: '800', marginTop: 4 },
  price: { color: colors.obsidian, fontSize: 18, fontWeight: '700', marginTop: 6 },
  desc: { color: colors.muted, marginTop: 12, lineHeight: 21 },
  label: { color: colors.obsidian, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  size: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.clayDark },
  sizeOn: { backgroundColor: colors.obsidian, borderColor: colors.obsidian },
  sizeText: { color: colors.obsidian, fontWeight: '600' },
  sizeTextOn: { color: colors.white },
  cta: { backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
