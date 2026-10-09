import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import ProductArt from '../components/ProductArt';
import { fetchProducts } from '../api';
import { Product } from '../data/products';

const CATS = ['All', 'T-Shirts', 'Shorts', 'Headsets', 'Accessories'];

export default function ProductsScreen({ navigation }: any) {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');

  useEffect(() => { fetchProducts().then((p) => { setAll(p); setLoading(false); }); }, []);

  const items = cat === 'All' ? all : all.filter((p) => p.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.head}>
        <Text style={styles.title}>All Products</Text>
        <Text style={styles.count}>{items.length} products</Text>
      </View>
      <View style={styles.filters}>
        {CATS.map((c) => (
             <TouchableOpacity key={c} testID={`products_filter_${c.toLowerCase()}`} onPress={() => setCat(c)} style={[styles.chip, cat === c && styles.chipOn]}>
               <Text style={[styles.chipText, cat === c && styles.chipTextOn]}>{c}</Text>
             </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.obsidian} />
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(p) => p.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, padding: 16 }}
          renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} testID={`products_product_card_${item.id}`} onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
                <ProductArt image={item.image} height={140} />
                <Text style={styles.cat}>{item.category.toUpperCase()}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
              </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.obsidian },
  count: { color: colors.muted, marginTop: 2 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.clayDark, backgroundColor: colors.white },
  chipOn: { backgroundColor: colors.obsidian, borderColor: colors.obsidian },
  chipText: { color: colors.obsidian, fontWeight: '600', fontSize: 13 },
  chipTextOn: { color: colors.white },
  card: { flex: 1 },
  cat: { color: 'rgba(11,18,21,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 8 },
  name: { color: colors.obsidian, fontSize: 14, fontWeight: '700', marginTop: 2 },
  price: { color: colors.obsidian, fontSize: 14, marginTop: 2 },
});
