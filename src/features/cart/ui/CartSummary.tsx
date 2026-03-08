// src/pages/cart/ui/CartSummary.tsx (ścieżkę dostosuj pod siebie)
import { Button } from '@shared/ui/Button';

import s from './styles/CartSummary.module.scss';

type Props = {
  totalQty: number;
  totalPrice: number;
  onCheckout: () => void;
};

export const CartSummary: React.FC<Props> = ({
  totalQty,
  totalPrice,
  onCheckout,
}) => {
  return (
    <aside className={s.checkoutContainer}>
      <div>
        <p className={s.totalPrice}>${totalPrice}</p>
        <p className={s.total}>Total for {totalQty} items</p>
      </div>

      <hr className={s.line} />

      <Button
        type="button"
        variant="primary"
        size="md"
        fullWidth
        onClick={onCheckout}
      >
        Checkout
      </Button>
    </aside>
  );
};
