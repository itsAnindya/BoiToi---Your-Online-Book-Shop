// Central place for all front‑end config.
// Reads Vite env vars (prefixed with VITE_) with sensible fallbacks.

export const API_BASE_URL   = import.meta.env.VITE_API_BASE_URL   ?? 'http://192.168.0.126:3001';
export const APP_NAME       = import.meta.env.VITE_APP_NAME       ?? 'BoiToi';
export const ITEMS_PER_PAGE = Number(import.meta.env.VITE_ITEMS_PER_PAGE ?? '12');
