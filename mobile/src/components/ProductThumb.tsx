import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import Logo from './Logo';

/**
 * Branded product tile. The web app draws detailed vector mockups; on mobile we
 * use a clean branded tile (clay backdrop + Waracle mark) so the catalogue
 * stays lightweight and dependency-free.
 */
export default function ProductThumb({ height = 150 }: { height?: number }) {
  return (
    <View style={[styles.tile, { height }]}>
      <Logo variant="dark" width={108} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    backgroundColor: colors.clay,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
