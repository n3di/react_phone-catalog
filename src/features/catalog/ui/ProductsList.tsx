// src/features/catalog/ui/ProductsList/ProductsList.tsx
import type { Product } from '../model/types';
import { ProductCard } from './ProductCard';
import s from './styles/ProductsList.module.scss';

type Props = {
  products: Product[];
};

export const ProductsList: React.FC<Props> = ({ products }) => {
  if (!products.length) {
    return null;
  }

  return (
    <div className={s.grid}>
      {products.map(product => (
        <ProductCard key={product.itemId} product={product} />
      ))}
    </div>
  );
};
