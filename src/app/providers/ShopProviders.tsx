// src/app/providers/ShopProviders.tsx
import { CartProvider } from '@features/cart/model/CartContext';
import { FavoritesProvider } from '@features/favorites/model/FavoritesContext';
import type { ReactNode } from 'react';
import { QueryProvider } from '@app/providers/QueryProvider';

type ShopProvidersProps = {
  children: ReactNode;
};

export function ShopProviders({ children }: ShopProvidersProps) {
  return (
    <QueryProvider>
      <FavoritesProvider>
        <CartProvider>{children}</CartProvider>
      </FavoritesProvider>
    </QueryProvider>
  );
};
