import React, { createContext, useContext, useMemo, useState } from 'react';
import { Product } from '../data/products';

export interface CartLine { product: Product; size: string; quantity: number; }

interface CartCtx {
  lines: CartLine[];
  add: (product: Product, size: string) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  coupon: string | undefined;
  setCoupon: (code: string | undefined) => void;
}

const Ctx = createContext<CartCtx | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<string | undefined>(undefined);

  const add = (product: Product, size: string) =>
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === product.id && l.size === size);
      if (i >= 0) { const next = [...prev]; next[i] = { ...next[i], quantity: next[i].quantity + 1 }; return next; }
      return [...prev, { product, size, quantity: 1 }];
    });
  const remove = (productId: string, size: string) =>
    setLines((prev) => prev.filter((l) => !(l.product.id === productId && l.size === size)));
  const clear = () => { setLines([]); setCoupon(undefined); };

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
    return { lines, add, remove, clear, count, subtotal, coupon, setCoupon };
  }, [lines, coupon]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used within CartProvider');
  return c;
};
