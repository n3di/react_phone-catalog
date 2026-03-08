import type { Product } from '@features/catalog/model/types';
import { useMemo } from 'react';

import { ProductsSlider } from './ProductsSlider';
import { ShopByCategory } from './ShopByCategory';
import s from './styles/HomePage.module.scss';
import { HeroCarouselContainer } from './HeroCarouselContainer';
import { useAllProducts } from '@features/catalog/queries/useAllProducts';

export default function HomePage() {
  const { data: all = [] } = useAllProducts();

  const { hot, brandNew, phonesCount, tabletsCount, accessoriesCount } =
    useMemo(() => {
      if (!all.length) {
        return {
          hot: [] as Product[],
          brandNew: [] as Product[],
          phonesCount: 0,
          tabletsCount: 0,
          accessoriesCount: 0,
        };
      }

      const brandNewSorted = [...all]
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
        .slice(0, 16);

      const hotSorted = [...all]
        .filter(p => (p.fullPrice ?? 0) > (p.price ?? 0))
        .sort((a, b) => {
          const discountA = (a.fullPrice ?? 0) - (a.price ?? 0);
          const discountB = (b.fullPrice ?? 0) - (b.price ?? 0);
          return discountB - discountA;
        });

      const phonesCount = all.filter(p => p.category === 'phones').length;
      const tabletsCount = all.filter(p => p.category === 'tablets').length;
      const accessoriesCount = all.filter(
        p => p.category === 'accessories',
      ).length;

      return {
        hot: hotSorted,
        brandNew: brandNewSorted,
        phonesCount,
        tabletsCount,
        accessoriesCount,
      };
    }, [all]);

  return (
    <div className={s.page}>
      <section className={s.hero}>
        <HeroCarouselContainer products={all} />
      </section>

      {brandNew.length > 0 && (
        <section className={s.brandNew}>
          <ProductsSlider title="Brand new models" products={brandNew} />
        </section>
      )}

      <section className={s.categories}>
        <ShopByCategory
          phonesCount={phonesCount}
          tabletsCount={tabletsCount}
          accessoriesCount={accessoriesCount}
        />
      </section>

      {hot.length > 0 && (
        <section className={s.hot}>
          <ProductsSlider title="Hot Prices" products={hot} />
        </section>
      )}
    </div>
  );
}
