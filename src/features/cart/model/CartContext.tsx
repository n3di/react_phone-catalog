// src/features/cart/model/CartContext.tsx
import { useLocalStorage } from '@shared/lib/useLocalStorage';
import { createContext, useContext, useMemo } from 'react';

import type { CartItem, CartProduct } from './types';

type CartState = {
  items: CartItem[];
  add: (p: CartProduct) => void;
  remove: (itemId: string) => void;
  inc: (itemId: string) => void;
  dec: (itemId: string) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number;
};

const Ctx = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart', []);

  const api: CartState = useMemo(() => {
    const add = (p: CartProduct) => {
      const id = p.itemId; // KLUCZ = SLUG

      setItems(prev =>
        prev.some(i => i.product.itemId === id)
          ? prev
          : [...prev, { product: p, quantity: 1 }],
      );
    };

    const remove = (itemId: string) =>
      setItems(prev => prev.filter(i => i.product.itemId !== itemId));

    const inc = (itemId: string) =>
      setItems(prev =>
        prev.map(i =>
          i.product.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );

    const dec = (itemId: string) =>
      setItems(prev =>
        prev.map(i =>
          i.product.itemId === itemId
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i,
        ),
      );

    const clear = () => setItems([]);

    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0,
    );

    return { items, add, remove, inc, dec, clear, totalQty, totalPrice };
  }, [items, setItems]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }

  return ctx;
};
