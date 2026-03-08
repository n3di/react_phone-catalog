// src/features/catalog/ui/ProductCard/ProductCard.tsx
import { paths } from '@app/router/paths';
import { useCart } from '@features/cart/model/CartContext';
import { toCartProduct } from '@features/cart/model/types';
import { useFavorites } from '@features/favorites/model/FavoritesContext';
import { FavoriteToggleButton } from '@features/favorites/ui/FavoriteToggleButton';
import { Button } from '@shared/ui/Button';
import { Link } from 'react-router-dom';

import type { Product } from '../model/types';
import s from './styles/ProductCard.module.scss';
import { assetUrl } from '@shared/lib/assets';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { add, items } = useCart();
  const { toggle, has } = useFavorites();

  const slug = product.itemId;

  // CartItem = { product: CartProduct; quantity: number }
  const inCart = items.some(item => item.product.itemId === slug);
  const favored = has(slug);

  const handleAddToCart = () => {
    if (!inCart) {
      // add oczekuje CartProduct, więc adaptujemy Product -> CartProduct
      add(toCartProduct(product));
    }
  };

  const handleToggleFavorite = () => {
    toggle(slug);
  };

  const screen = product.screen || '—';
  const capacity = product.capacity || '—';
  const ram = product.ram || '—';

  return (
    <article className={s.card}>
      <Link
        to={paths.productDetails(slug)}
        className={s.imageLink}
        aria-label={product.name}
      >
        <div className={s.imgWrap}>
          <img
            src={assetUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className={s.img}
          />
        </div>
      </Link>

      <Link to={paths.productDetails(slug)} className={s.title}>
        {product.name}
      </Link>

      <div className={s.prices}>
        <span className={s.price}>${product.price}</span>

        {product.fullPrice > product.price && (
          <span className={s.fullPrice}>${product.fullPrice}</span>
        )}
      </div>

      <hr className={s.divider} />

      <dl className={s.specs}>
        <div className={s.specRow}>
          <dt className={s.specLabel}>Screen</dt>
          <dd className={s.specValue}>{screen}</dd>
        </div>

        <div className={s.specRow}>
          <dt className={s.specLabel}>Capacity</dt>
          <dd className={s.specValue}>{capacity}</dd>
        </div>

        <div className={s.specRow}>
          <dt className={s.specLabel}>RAM</dt>
          <dd className={s.specValue}>{ram}</dd>
        </div>
      </dl>

      <div className={s.footer}>
        <Button
          variant={inCart ? 'secondary' : 'primary'}
          size="md"
          fullWidth={false}
          className={s.cartButton}
          onClick={handleAddToCart}
          disabled={inCart}
        >
          {inCart ? 'Added' : 'Add to cart'}
        </Button>

        <FavoriteToggleButton
          active={favored}
          onToggle={handleToggleFavorite}
          className={s.favButton}
        />
      </div>
    </article>
  );
};
