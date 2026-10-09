import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const dark = require('../../assets/logo-dark.png');
const white = require('../../assets/logo-white.png');

// Real Waracle logo. Aspect ratio of the source asset is ~724:122.
export default function Logo({ variant = 'dark', width = 132, style }: { variant?: 'dark' | 'light'; width?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={variant === 'dark' ? dark : white}
      style={[{ width, height: (width * 122) / 724, resizeMode: 'contain' }, style]}
    />
  );
}
