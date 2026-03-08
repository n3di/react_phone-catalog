import type { Product } from '@features/catalog/model/types';

export type CartProduct = {
  itemId: string;
  name: string;
  price: number;
  image: string;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export const toCartProduct = (p: Product): CartProduct => ({
  itemId: p.itemId ?? String(p.id), // fallback na id jeśli naprawdę potrzebujesz
  name: p.name,
  price: p.price, // TU NIE MA ŻADNEGO any, używamy normalnego pola
  image: p.image ?? '',
});
