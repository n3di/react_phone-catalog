// src/features/products/model/types.ts
export type Category = 'phones' | 'tablets' | 'accessories';

// Lista / katalog – to, co jest w products.json
export interface Product {
  id: number; // numeric ID tylko lokalnie
  itemId: string; // slug
  category: Category;
  name: string;
  fullPrice: number;
  price: number;
  screen: string;
  capacity: string;
  color: string;
  ram: string;
  year: number;
  image: string; // np. "img/phones/..."
}

export interface ProductDescriptionBlock {
  title: string;
  text: string[];
}

// Szczegóły – to, co jest w phones/tablets/accessories JSON
export interface ProductDetails {
  id: string; // slug
  numericId?: number;
  category: Category;
  namespaceId?: string;

  name: string;

  capacityAvailable?: string[];
  capacity?: string;

  priceRegular?: number;
  priceDiscount?: number;

  colorsAvailable?: string[];
  color?: string;

  images?: string[]; // kolekcja obrazków
  image?: string; // fallback – pojedynczy obrazek

  description?: ProductDescriptionBlock[];

  screen?: string;
  resolution?: string;
  processor?: string;
  ram?: string;

  camera?: string; // np. w phones/tablets
  zoom?: string; // nie każdy accessory to ma

  cell?: string[];
}
