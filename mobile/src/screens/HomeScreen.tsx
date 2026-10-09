import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { colors, TAGLINE, VALUES } from '../theme';
import Logo from '../components/Logo';
import ProductArt from '../components/ProductArt';
import { fetchProducts } from '../api';
import { Product } from '../data/products';

export default function HomeScreen({ navigation }: any) {
  const [featured, setFeatured] = useState<Product[]>([]);
  useEffect(() => { fetchProducts().then((p) => setFeatured(p.slice(0, 4))); }, []);

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      {/* Hero */}
      <View style={styles.hero}>
        <Logo variant="light" width={140} />
        <Text style={styles.heroTitle}>{TAGLINE}</Text>
        <Text style={styles.heroSub}>Official Waracle apparel and gear, for the people who design and engineer the products millions rely on.</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity style={styles.cta} testID="home_shop_now_button" onPress={() => navigation.navigate('Products')}>
              <Text style={styles.ctaText}>Shop Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaOutline} testID="home_signin_button" onPress={() => navigation.navigate('Login')}>
              <Text style={styles.ctaOutlineText}>Sign in / Register</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Values */}
      <View style={styles.section}>
        <Text style={styles.eyebrow}>OUR VALUES</Text>
        <Text style={styles.h2}>What we stand for</Text>
        {VALUES.map((v, i) => (
          <View key={v} style={styles.valueRow}>
            <Text style={styles.valueNum}>0{i + 1}</Text>
            <Text style={styles.valueLabel}>{v}</Text>
          </View>
        ))}
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{TAGLINE}</Text>
      </View>

      {/* Featured */}
      <View style={styles.section}>
        <Text style={styles.eyebrow}>FEATURED</Text>
        <Text style={styles.h2}>New in</Text>
        <FlatList
          scrollEnabled={false}
          data={featured}
          numColumns={2}
          keyExtractor={(p) => p.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, marginTop: 12 }}
          renderItem={({ item }) => (
             <TouchableOpacity style={styles.card} testID={`home_product_card_${item.id}`} onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
               <ProductArt image={item.image} height={130} />
               <Text style={styles.cat}>{item.category.toUpperCase()}</Text>
               <Text style={styles.name}>{item.name}</Text>
               <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
             </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.obsidian, padding: 24, paddingTop: 40, paddingBottom: 36 },
  heroTitle: { color: colors.white, fontSize: 30, fontWeight: '800', marginTop: 20, lineHeight: 34 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: 12, lineHeight: 21 },
  cta: { backgroundColor: colors.accent, paddingHorizontal: 22, paddingVertical: 13, borderRadius: 10 },
  ctaOutline: { borderColor: 'rgba(255,255,255,0.4)', borderWidth: 1, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 10 },
  ctaOutlineText: { color: colors.white, fontWeight: '700' },
  ctaText: { color: colors.white, fontWeight: '700' },
  section: { padding: 24 },
  eyebrow: { color: 'rgba(11,18,21,0.5)', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  h2: { fontSize: 24, fontWeight: '800', color: colors.obsidian, marginTop: 6, marginBottom: 8 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.clay },
  valueNum: { color: 'rgba(11,18,21,0.4)', fontWeight: '800' },
  valueLabel: { color: colors.obsidian, fontSize: 16, fontWeight: '600' },
  banner: { backgroundColor: colors.clay, padding: 28 },
  bannerText: { color: colors.obsidian, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  card: { flex: 1 },
  cat: { color: 'rgba(11,18,21,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 8 },
  name: { color: colors.obsidian, fontSize: 14, fontWeight: '700', marginTop: 2 },
  price: { color: colors.obsidian, fontSize: 14, marginTop: 2 },
});
