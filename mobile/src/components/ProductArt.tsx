import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Path, Rect, Ellipse, Circle, Image as SvgImage } from 'react-native-svg';
import { colors } from '../theme';

const logoWhite = require('../../assets/logo-white.png');
const logoDark = require('../../assets/logo-dark.png');

// Unique-id counter so gradient ids never clash across the many tiles a list renders.
let _seq = 0;

interface Palette { c1: string; c2: string; c3: string; collar: string; collarOpacity: number; rib: string; shade: number; fold: string; light: boolean; }
const TEE: Record<string, Palette> = {
  black: { c1: '#2a2a2a', c2: '#141414', c3: '#000000', collar: '#000000', collarOpacity: 0.5, rib: '#444444', shade: 0.16, fold: '#333333', light: false },
  white: { c1: '#ffffff', c2: '#f2f2f4', c3: '#e7e7eb', collar: '#ccccd2', collarOpacity: 0.7, rib: '#d2d2d8', shade: 0.05, fold: '#d6d6dc', light: true },
  grey: { c1: '#d6d9de', c2: '#bfc2c9', c3: '#a8acb3', collar: '#90949b', collarOpacity: 0.5, rib: '#9aa0a8', shade: 0.1, fold: '#9398a0', light: true },
};
interface ShortsPalette { c1: string; c2: string; c3: string; band: string; }
const SHORTS: Record<string, ShortsPalette> = {
  black: { c1: '#262626', c2: '#141414', c3: '#040404', band: '#1e1e1e' },
  heather: { c1: '#5c6066', c2: '#44474d', c3: '#2b2d31', band: '#3e4146' },
};

function Logo({ cx, cy, w, light }: { cx: number; cy: number; w: number; light: boolean }) {
  const h = w * (122 / 724);
  return <SvgImage href={light ? logoDark : logoWhite} x={cx - w / 2} y={cy - h / 2} width={w} height={h} preserveAspectRatio="xMidYMid meet" />;
}

function TeeMen({ p, uid }: { p: Palette; uid: string }) {
  const g = `teem-${uid}`;
  return (
    <>
      <Defs>
        <LinearGradient id={g} x1="0.15" y1="0" x2="0.85" y2="1">
          <Stop offset="0" stopColor={p.c1} /><Stop offset="0.45" stopColor={p.c2} /><Stop offset="1" stopColor={p.c3} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="120" cy="214" rx="66" ry="8" fill="#000" opacity={0.07} />
      <Path d="M92 50 C100 45 140 45 148 50 C158 51 168 55 178 61 L200 76 C203 78 204 82 201 86 L184 112 C182 115 178 115 175 112 L168 104 L170 198 C170 202 167 205 163 205 L77 205 C73 205 70 202 70 198 L72 104 L65 112 C62 115 58 115 56 112 L39 86 C36 82 37 78 40 76 L62 61 C72 55 82 51 92 50 Z" fill={`url(#${g})`} />
      <Path d="M92 50 C103 65 137 65 148 50 C143 60 132 65 120 65 C108 65 97 60 92 50 Z" fill={p.collar} opacity={p.collarOpacity} />
      <Path d="M95 51 C105 63 135 63 145 51" fill="none" stroke={p.rib} strokeWidth={3} strokeLinecap="round" />
      <Path d="M70 104 C76 100 86 99 96 100" stroke="#000" strokeWidth={2} opacity={0.25} fill="none" />
      <Path d="M170 104 C164 100 154 99 144 100" stroke="#000" strokeWidth={2} opacity={0.25} fill="none" />
      <Path d="M70 104 L72 198 C72 202 75 205 79 205 L94 205 L94 104 Z" fill="#000" opacity={p.shade} />
      <Path d="M170 104 L168 198 C168 202 165 205 161 205 L146 205 L146 104 Z" fill="#000" opacity={p.shade} />
      <Path d="M104 116 C108 150 108 180 105 202" stroke={p.fold} strokeWidth={2} fill="none" opacity={0.45} />
      <Path d="M136 116 C132 150 132 180 135 202" stroke={p.fold} strokeWidth={2} fill="none" opacity={0.45} />
      <Logo cx={120} cy={118} w={88} light={p.light} />
    </>
  );
}

function TeeWomen({ p, uid }: { p: Palette; uid: string }) {
  const g = `teew-${uid}`;
  return (
    <>
      <Defs>
        <LinearGradient id={g} x1="0.15" y1="0" x2="0.85" y2="1">
          <Stop offset="0" stopColor={p.c1} /><Stop offset="0.45" stopColor={p.c2} /><Stop offset="1" stopColor={p.c3} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="120" cy="210" rx="54" ry="8" fill="#000" opacity={0.07} />
      <Path d="M98 52 C106 47 134 47 142 52 C152 54 162 58 170 64 L188 78 C191 80 192 84 189 88 L174 110 C172 113 168 113 166 110 L160 102 C160 102 158 130 156 152 C154 174 150 190 147 200 C146 203 144 204 141 204 L99 204 C96 204 94 203 93 200 C90 190 86 174 84 152 C82 130 80 102 80 102 L74 110 C72 113 68 113 66 110 L51 88 C48 84 49 80 52 78 L70 64 C78 58 88 54 98 52 Z" fill={`url(#${g})`} />
      <Path d="M98 52 C107 67 133 67 142 52 C136 62 130 67 120 67 C110 67 104 62 98 52 Z" fill={p.collar} opacity={p.collarOpacity} />
      <Path d="M101 53 C109 65 131 65 139 53" fill="none" stroke={p.rib} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M84 152 C86 174 90 190 93 200 C94 203 96 204 99 204 L112 204 L110 112 L86 114 Z" fill="#000" opacity={p.shade} />
      <Path d="M156 152 C154 174 150 190 147 200 C146 203 144 204 141 204 L128 204 L130 112 L154 114 Z" fill="#000" opacity={p.shade} />
      <Path d="M106 118 C108 152 108 182 106 202" stroke={p.fold} strokeWidth={1.8} fill="none" opacity={0.45} />
      <Path d="M134 118 C132 152 132 182 134 202" stroke={p.fold} strokeWidth={1.8} fill="none" opacity={0.45} />
      <Logo cx={120} cy={118} w={78} light={p.light} />
    </>
  );
}

function Shorts({ p, uid }: { p: ShortsPalette; uid: string }) {
  const g = `sh-${uid}`;
  return (
    <>
      <Defs>
        <LinearGradient id={g} x1="0.2" y1="0" x2="0.8" y2="1">
          <Stop offset="0" stopColor={p.c1} /><Stop offset="0.5" stopColor={p.c2} /><Stop offset="1" stopColor={p.c3} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="120" cy="202" rx="66" ry="8" fill="#000" opacity={0.07} />
      <Path d="M60 72 C60 67 64 64 69 64 L171 64 C176 64 180 67 180 72 L177 122 C176 152 173 172 169 190 C168 194 165 196 161 196 L139 196 C135 196 132 194 131 190 L123 140 C122 133 118 133 117 140 L109 190 C108 194 105 196 101 196 L79 196 C75 196 72 194 71 190 C67 172 64 152 63 122 Z" fill={`url(#${g})`} />
      <Path d="M60 72 C60 67 64 64 69 64 L171 64 C176 64 180 67 180 72 L179 88 L61 88 Z" fill={p.band} />
      <Rect x="60" y="86" width="120" height="3" fill="#000" opacity={0.4} />
      <Path d="M112 88 C110 99 110 108 113 116" stroke="#000" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <Path d="M128 88 C130 99 130 108 127 116" stroke="#000" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <Path d="M63 122 C64 152 67 172 71 190 C72 194 75 196 79 196 L92 196 L96 122 Z" fill="#000" opacity={0.2} />
      <Path d="M177 122 C176 152 173 172 169 190 C168 194 165 196 161 196 L148 196 L144 122 Z" fill="#000" opacity={0.2} />
      <Path d="M86 98 C84 132 84 162 87 188" stroke="#000" strokeWidth={2} fill="none" opacity={0.25} />
      <Path d="M154 98 C156 132 156 162 153 188" stroke="#000" strokeWidth={2} fill="none" opacity={0.25} />
      <Logo cx={94} cy={154} w={44} light={false} />
    </>
  );
}

function Headset({ uid }: { uid: string }) {
  const band = `hb-${uid}`, cup = `hc-${uid}`, pad = `hp-${uid}`;
  return (
    <>
      <Defs>
        <LinearGradient id={band} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#3a3a3a" /><Stop offset="1" stopColor="#0c0c0c" /></LinearGradient>
        <LinearGradient id={cup} x1="0" y1="0" x2="1" y2="0.6"><Stop offset="0" stopColor="#454545" /><Stop offset="0.55" stopColor="#1c1c1c" /><Stop offset="1" stopColor="#000" /></LinearGradient>
        <RadialGradient id={pad} cx="0.42" cy="0.4" r="0.75"><Stop offset="0" stopColor="#2e2e2e" /><Stop offset="1" stopColor="#000" /></RadialGradient>
      </Defs>
      <Ellipse cx="120" cy="208" rx="60" ry="8" fill="#000" opacity={0.07} />
      <Path d="M54 154 L54 116 C54 62 86 38 120 38 C154 38 186 62 186 116 L186 154" fill="none" stroke={`url(#${band})`} strokeWidth={18} strokeLinecap="round" />
      <Path d="M62 120 C62 72 88 50 120 50 C152 50 178 72 178 120" fill="none" stroke="#000" strokeWidth={4} opacity={0.3} />
      <Path d="M72 60 C92 47 120 45 150 56" stroke="#5a5a5a" strokeWidth={3.5} fill="none" opacity={0.55} strokeLinecap="round" />
      <Rect x="47" y="120" width="14" height="40" rx="7" fill="#161616" />
      <Rect x="179" y="120" width="14" height="40" rx="7" fill="#161616" />
      <Rect x="34" y="140" width="50" height="72" rx="24" fill={`url(#${cup})`} />
      <Ellipse cx="59" cy="176" rx="17" ry="28" fill={`url(#${pad})`} />
      <Ellipse cx="59" cy="176" rx="17" ry="28" fill="none" stroke="#000" strokeWidth={2} opacity={0.5} />
      <Rect x="156" y="140" width="50" height="72" rx="24" fill={`url(#${cup})`} />
      <Ellipse cx="181" cy="176" rx="17" ry="28" fill={`url(#${pad})`} />
      <Ellipse cx="181" cy="176" rx="17" ry="28" fill="none" stroke="#000" strokeWidth={2} opacity={0.5} />
      <Path d="M181 210 C181 222 170 226 158 224" stroke="#111" strokeWidth={3} fill="none" strokeLinecap="round" />
    </>
  );
}

function Cap({ uid }: { uid: string }) {
  const crown = `cc-${uid}`, brim = `cb-${uid}`;
  return (
    <>
      <Defs>
        <LinearGradient id={crown} x1="0" y1="0" x2="0.4" y2="1"><Stop offset="0" stopColor="#222" /><Stop offset="0.6" stopColor="#0f0f0f" /><Stop offset="1" stopColor="#000" /></LinearGradient>
        <LinearGradient id={brim} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#151515" /><Stop offset="1" stopColor="#000" /></LinearGradient>
      </Defs>
      <Ellipse cx="120" cy="184" rx="74" ry="9" fill="#000" opacity={0.06} />
      <Path d="M58 150 C70 176 176 176 214 158 C220 155 219 147 212 146 C170 150 120 150 120 150 L92 150 C78 150 64 150 58 150 Z" fill={`url(#${brim})`} />
      <Path d="M60 152 C56 104 84 66 120 66 C156 66 184 104 180 152 C150 160 90 160 60 152 Z" fill={`url(#${crown})`} />
      <Path d="M120 78 L120 156" stroke="#000" strokeWidth={2.5} opacity={0.4} />
      <Path d="M94 80 C88 110 86 132 88 155" stroke="#000" strokeWidth={2} opacity={0.3} fill="none" />
      <Path d="M146 80 C152 110 154 132 152 155" stroke="#000" strokeWidth={2} opacity={0.3} fill="none" />
      <Circle cx="120" cy="66" r="5" fill="#1a1a1a" />
      <Logo cx={120} cy={116} w={52} light={false} />
    </>
  );
}

export default function ProductArt({ image, height = 150, radius = 16 }: { image: string; height?: number; radius?: number }) {
  const uid = useMemo(() => `g${++_seq}`, []);
  let art: React.ReactNode;
  switch (image) {
    case 'tshirt-black': art = <TeeMen p={TEE.black} uid={uid} />; break;
    case 'tshirt-white': art = <TeeMen p={TEE.white} uid={uid} />; break;
    case 'tshirt-grey': art = <TeeMen p={TEE.grey} uid={uid} />; break;
    case 'tee-w-black': art = <TeeWomen p={TEE.black} uid={uid} />; break;
    case 'tee-w-white': art = <TeeWomen p={TEE.white} uid={uid} />; break;
    case 'shorts-black': art = <Shorts p={SHORTS.black} uid={uid} />; break;
    case 'shorts-heather': art = <Shorts p={SHORTS.heather} uid={uid} />; break;
    case 'headset': art = <Headset uid={uid} />; break;
    case 'cap': art = <Cap uid={uid} />; break;
    default: art = <TeeMen p={TEE.black} uid={uid} />;
  }
  const side = Math.round(height * 0.82);
  return (
    <View style={{ height, width: '100%', backgroundColor: colors.clay, borderRadius: radius, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <Svg width={side} height={side} viewBox="0 0 240 240">{art}</Svg>
    </View>
  );
}
