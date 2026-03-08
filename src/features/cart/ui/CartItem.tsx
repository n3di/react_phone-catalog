import { paths } from '@app/router/paths';
import type { CartItem as CartItemType } from '@features/cart/model/types';
import {
  close as CloseIcon,
  minus as MinusIcon,
  plus as PlusIcon,
} from '@shared/assets/icons';
import { IconButton } from '@shared/ui/IconButton';
import { Link } from 'react-router-dom';

import s from './styles/CartItem.module.scss';
import { assetUrl } from '@shared/lib/assets';

type Props = {
  item: CartItemType;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
};

export const CartItem: React.FC<Props> = ({ item, onInc, onDec, onRemove }) => {
  const { product, quantity } = item;
  const to = paths.productDetails(product.itemId);

  return (
    <li className={s.item}>
      <IconButton
        size="sm"
        className={s.remove}
        onClick={onRemove}
        aria-label="Remove item"
        title="Remove item"
      >
        <CloseIcon className={s.icon} aria-hidden="true" focusable="false" />
      </IconButton>

      <Link to={to} className={s.imageWrap} aria-label={`Open ${product.name}`}>
        <img
          src={assetUrl(product.image)}
          alt={product.name}
          className={s.image}
          loading="lazy"
        />
      </Link>

      <Link to={to} className={s.title}>
        {product.name}
      </Link>

      <div className={s.qty}>
        <IconButton
          size="sm"
          className={s.qtyBtn}
          onClick={onDec}
          aria-label="Decrease quantity"
          title="Decrease quantity"
        >
          <MinusIcon className={s.icon} aria-hidden="true" focusable="false" />
        </IconButton>

        <span className={s.qtyValue} aria-live="polite">
          {quantity}
        </span>

        <IconButton
          size="sm"
          className={s.qtyBtn}
          onClick={onInc}
          aria-label="Increase quantity"
          title="Increase quantity"
        >
          <PlusIcon className={s.icon} aria-hidden="true" focusable="false" />
        </IconButton>
      </div>

      <p className={s.price}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(product.price * quantity)}
      </p>
    </li>
  );
};
