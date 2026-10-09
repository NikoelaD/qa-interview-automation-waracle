/**
 * Mobile data access. Uses the real backend when EXPO_PUBLIC_API_URL is set,
 * and transparently falls back to bundled sample data (so the app runs with no
 * backend, and degrades gracefully if the API is unreachable).
 */
import axios from 'axios';
import { API_URL } from './config';
import { products as sample, Product } from './data/products';

const client = API_URL ? axios.create({ baseURL: `${API_URL.replace(/\/$/, '')}/api` }) : null;
export const usingBackend = !!client;

let authToken: string | null = null;
export function setAuthToken(token: string | null) { authToken = token; }
function authHeaders() { return authToken ? { Authorization: `Bearer ${authToken}` } : {}; }

export interface AuthUser { firstName: string; lastName: string; email: string; }

export async function fetchProducts(): Promise<Product[]> {
  if (!client) return sample;
  try { const res = await client.get('/products'); return res.data.products as Product[]; }
  catch { return sample; }
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  if (!client) return sample.find((p) => p.id === id);
  try { const res = await client.get(`/products/${id}`); return res.data.product as Product; }
  catch { return sample.find((p) => p.id === id); }
}

export async function apiLogin(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  if (!client) {
    if (!email || !password) throw new Error('Enter your email and password.');
    return { token: 'offline-token', user: { firstName: email.split('@')[0] || 'Guest', lastName: '', email } };
  }
  const res = await client.post('/auth/login', { email, password });
  return res.data;
}

export async function apiRegister(payload: { firstName: string; lastName: string; email: string; password: string }): Promise<{ token: string; user: AuthUser }> {
  if (!client) {
    return { token: 'offline-token', user: { firstName: payload.firstName, lastName: payload.lastName, email: payload.email } };
  }
  const res = await client.post('/auth/register', payload);
  return res.data;
}

export interface OrderResult { orderNumber: string; total: number; }

export async function apiCreateOrder(body: any): Promise<OrderResult> {
  if (!client) {
    // Offline fallback: fabricate an order confirmation.
    return { orderNumber: 'WS-OFFLINE-' + String(Date.now()).slice(-6), total: body?._total ?? 0 };
  }
  const res = await client.post('/orders', body, { headers: authHeaders() });
  const o = res.data.order;
  return { orderNumber: o.orderNumber, total: o.total };
}
