// src/features/favorites/ui/FavoritesPage/FavoritesPage.tsx
import { productsApi } from '@features/catalog/api/productsApi';
import type { Product } from '@features/catalog/model/types';
import { ProductsList } from '@features/catalog/ui/ProductsList';
import { useFavorites } from '@features/favorites/model/FavoritesContext';
import {
  arrowRight as ArrowRightIcon,
  home as HomeIcon,
} from '@shared/assets/icons';
import { useEffect, useState } from 'react';

import s from './styles/FavoritesPage.module.scss';

export default function FavoritesPage() {
  const { ids, count } = useFavorites(); // ids: string[] (slug-i)
  const [all, setAll] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const list = await productsApi.getAll(controller.signal);

        setAll(list);
      } finally {
        setIsLoading(false);
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  const favorites = all.filter(p => ids.includes(p.itemId));

  if (isLoading) {
    return (
      <section className={s.page}>
        <h1 className={s.title}>Favorites ({count})</h1>
        <p className={s.text}>Loading favorites...</p>
      </section>
    );
  }

  return (
    <section className={s.page}>
      <div className={s.header}>
        <nav className={s.breadcrumbs}>
          <HomeIcon className={s.icon} aria-hidden="true" focusable="false" />
          <ArrowRightIcon
            className={s.icon}
            aria-hidden="true"
            focusable="false"
          />
          <span className={s.name}>Favorites</span>
        </nav>

        <div className={s.gap}>
          <h1 className={s.title}>Favorites</h1>
          <p className={s.count}>{count} items</p>
        </div>
      </div>

      {favorites.length ? (
        <ProductsList products={favorites} />
      ) : (
        <p className={s.empty}>No favorites yet</p>
      )}
    </section>
  );
};
