// src/features/products/api/productsApi.ts
import type { Category, Product, ProductDetails } from '../model/types';

const BASE = `${import.meta.env.BASE_URL}api`;

const isHttpUrl = (src: string) =>
  src.startsWith('http://') || src.startsWith('https://');

const normalizePath = (src?: string | null): string | undefined => {
  if (!src) return undefined;
  return isHttpUrl(src) ? src : src.startsWith('/') ? src : `/${src}`;
};

type ProductDetailsRaw = Omit<ProductDetails, 'id' | 'image' | 'images'> & {
  id: string | number;
  itemId?: string;
  image?: string | null;
  images?: (string | null | undefined)[];
};

const adaptDetails = (raw: ProductDetailsRaw): ProductDetails => {
  const primary = normalizePath(raw.image ?? undefined);

  let images: string[] | undefined;

  if (Array.isArray(raw.images)) {
    const normalized = raw.images
      .map(img => normalizePath(img ?? undefined))
      .filter((img): img is string => Boolean(img));

    if (normalized.length > 0) images = normalized;
    else if (primary) images = [primary];
  } else if (primary) {
    images = [primary];
  }

  const idAsSlug =
    typeof raw.id === 'string' ? raw.id : (raw.itemId ?? String(raw.id));

  return {
    ...raw,
    id: idAsSlug,
    image: primary,
    images,
  };
};

// --------------------
// fetch helper (304-safe)
// --------------------
async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, cache: 'force-cache' });

  // dev server czasem zwraca 304 bez body -> powtórz z reload
  if (res.status === 304) {
    const res2 = await fetch(url, { signal, cache: 'reload' });
    if (!res2.ok)
      throw new Error(`Request failed: ${res2.status} ${res2.statusText}`);
    return (await res2.json()) as T;
  }

  if (!res.ok)
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

// --------------------
// caches
// --------------------
let cacheAll: Product[] | null = null;
let indexByItemId: Record<string, Product> | null = null;
let indexSlugToNumeric: Record<string, number> | null = null;
let indexNumericToSlug: Record<number, string> | null = null;

const categoryCache = new Map<Category, ProductDetailsRaw[]>();
const categoryInflight = new Map<Category, Promise<ProductDetailsRaw[]>>();

const detailsCache = new Map<string, ProductDetails>();
const detailsInflight = new Map<string, Promise<ProductDetails>>();

async function ensureAll(signal?: AbortSignal): Promise<Product[]> {
  if (cacheAll) return cacheAll;
  cacheAll = await fetchJSON<Product[]>(`${BASE}/products.json`, signal);
  return cacheAll;
}

async function ensureIndexes(signal?: AbortSignal) {
  if (indexByItemId && indexSlugToNumeric && indexNumericToSlug) return;

  const all = await ensureAll(signal);

  indexByItemId = {};
  indexSlugToNumeric = {};
  indexNumericToSlug = {};

  for (const p of all) {
    indexByItemId[p.itemId] = p;
    indexSlugToNumeric[p.itemId] = p.id;
    indexNumericToSlug[p.id] = p.itemId;
  }
}

async function ensureCategory(category: Category, signal?: AbortSignal) {
  const cached = categoryCache.get(category);
  if (cached) return cached;

  const inflight = categoryInflight.get(category);
  if (inflight) return inflight;

  const p = fetchJSON<ProductDetailsRaw[]>(`${BASE}/${category}.json`, signal)
    .then(list => {
      categoryCache.set(category, list);
      return list;
    })
    .finally(() => {
      categoryInflight.delete(category);
    });

  categoryInflight.set(category, p);
  return p;
}

export const productsApi = {
  async getAll(signal?: AbortSignal): Promise<Product[]> {
    return ensureAll(signal);
  },

  async getByCategory(
    category: Category,
    signal?: AbortSignal,
  ): Promise<Product[]> {
    const all = await ensureAll(signal);
    return all.filter(p => p.category === category);
  },

  async findItemIdByNumericId(
    numericId: number,
    signal?: AbortSignal,
  ): Promise<string | null> {
    await ensureIndexes(signal);
    return indexNumericToSlug![numericId] ?? null;
  },

  async findNumericIdByItemId(
    itemId: string,
    signal?: AbortSignal,
  ): Promise<number | null> {
    await ensureIndexes(signal);
    return indexSlugToNumeric![itemId] ?? null;
  },

  // ✅ Details: 1 request tylko do pliku kategorii danego produktu
  async getDetails(
    itemId: string,
    signal?: AbortSignal,
  ): Promise<ProductDetails> {
    const cached = detailsCache.get(itemId);
    if (cached) return cached;

    const inflight = detailsInflight.get(itemId);
    if (inflight) return inflight;

    const p = (async () => {
      await ensureIndexes(signal);

      const listItem = indexByItemId![itemId];
      if (!listItem) {
        // Jeśli slug nie istnieje w products.json, to produkt faktycznie nie istnieje w Twoim modelu.
        throw new Error('Product not found');
      }

      const categoryList = await ensureCategory(listItem.category, signal);

      const raw =
        categoryList.find(d => d.id === itemId || d.itemId === itemId) ?? null;

      if (!raw) {
        throw new Error('Product not found');
      }

      const details = adaptDetails(raw);

      const result: ProductDetails = {
        ...details,
        numericId: listItem.id,
      };

      detailsCache.set(itemId, result);
      return result;
    })().finally(() => {
      detailsInflight.delete(itemId);
    });

    detailsInflight.set(itemId, p);
    return p;
  },

  async getSuggested(
    currentItemId?: string,
    signal?: AbortSignal,
  ): Promise<Product[]> {
    const all = await ensureAll(signal);
    const pool = currentItemId
      ? all.filter(p => p.itemId !== currentItemId)
      : all;
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
  },
};
