import { paths } from '@app/router/paths';
import { useCart } from '@features/cart/model/CartContext';
import { CartItem } from '@features/cart/ui/CartItem';
import { CartSummary } from '@features/cart/ui/CartSummary';
import { arrowLeft as ArrowLeftIcon } from '@shared/assets/icons';
import { Link, useNavigate } from 'react-router-dom';

import s from './styles/CartPage.module.scss';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, remove, inc, dec, totalPrice, totalQty, clear } = useCart();

  const checkout = () => {
    if (
      confirm('Checkout is not implemented yet. Do you want to clear the Cart?')
    ) {
      clear();
    }
  };

  if (!items.length) {
    return (
      <section className={s.page}>
        <h1 className={s.title}>Cart</h1>
        <p className={s.empty}>Your cart is empty</p>
        <Link to={paths.catalog.phones} className={s.cta}>
          Browse phones
        </Link>
      </section>
    );
  }

  return (
    <section className={s.page}>
      <header className={s.header}>
        <button
          type="button"
          className={s.backButton}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeftIcon
            className={s.icon}
            aria-hidden="true"
            focusable="false"
          />
          <span className={s.backText}>Back</span>
        </button>

        <h1 className={s.title}>Cart</h1>
      </header>

      <div className={s.content}>
        <ul className={s.list}>
          {items.map(item => (
            <CartItem
              key={item.product.itemId}
              item={item}
              onInc={() => inc(item.product.itemId)}
              onDec={() => dec(item.product.itemId)}
              onRemove={() => remove(item.product.itemId)}
            />
          ))}
        </ul>

        <CartSummary
          totalQty={totalQty}
          totalPrice={totalPrice}
          onCheckout={checkout}
        />
      </div>
    </section>
  );
};
