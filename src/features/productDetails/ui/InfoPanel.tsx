import type { ProductDetails } from '@features/catalog/model/types';
import { FavoriteToggleButton } from '@features/favorites/ui/FavoriteToggleButton';
import { Button } from '@shared/ui/Button';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react';

import s from './styles/InfoPanel.module.scss';
import { formatProductId } from '@shared/lib/formatProductID';

type Props = {
  data: ProductDetails;
  selectedColor: string | null;
  setSelectedColor: Dispatch<SetStateAction<string | null>>;
  selectedCapacity: string | null;
  setSelectedCapacity: Dispatch<SetStateAction<string | null>>;
  onVariantChange: (
    nextColor: string | null,
    nextCapacity: string | null,
  ) => void;

  onVariantPrefetch: (
    nextColor: string | null,
    nextCapacity: string | null,
  ) => void;
  variantsPending: boolean;

  inCart: boolean;
  handleAddToCart: () => void;
  favored: boolean;
  handleToggleFavorite: () => void;
};

const PREFETCH_DELAY_MS = 160;

export const InfoPanel = memo(function InfoPanel({
  data,
  selectedColor,
  setSelectedColor,
  selectedCapacity,
  setSelectedCapacity,
  onVariantChange,
  onVariantPrefetch,
  variantsPending,
  inCart,
  handleAddToCart,
  favored,
  handleToggleFavorite,
}: Props) {
  const specs = useMemo(() => {
    return [
      data.screen && { label: 'Screen', value: data.screen },
      data.resolution && { label: 'Resolution', value: data.resolution },
      data.processor && { label: 'Processor', value: data.processor },
      data.ram && { label: 'RAM', value: data.ram },
    ].filter(Boolean) as { label: string; value: string }[];
  }, [data.screen, data.resolution, data.processor, data.ram]);

  // -----------------------
  // Intent-based prefetch
  // -----------------------
  const tRef = useRef<number | null>(null);

  const cancelPrefetch = useCallback(() => {
    if (tRef.current != null) {
      window.clearTimeout(tRef.current);
      tRef.current = null;
    }
  }, []);

  const schedulePrefetch = useCallback(
    (nextColor: string | null, nextCapacity: string | null) => {
      // Prefetch ma sens tylko gdy mamy oba parametry
      if (!nextColor || !nextCapacity) return;

      // Podczas pending i tak blokujesz zmianę wariantu, więc nie ma sensu spamować
      if (variantsPending) return;

      cancelPrefetch();
      tRef.current = window.setTimeout(() => {
        onVariantPrefetch(nextColor, nextCapacity);
        tRef.current = null;
      }, PREFETCH_DELAY_MS);
    },
    [cancelPrefetch, onVariantPrefetch, variantsPending],
  );

  useEffect(() => cancelPrefetch, [cancelPrefetch]);

  const optionClass = useCallback(
    (active: boolean) => (active ? `${s.option} ${s.optionActive}` : s.option),
    [],
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      onVariantChange(color, selectedCapacity);
    },
    [onVariantChange, selectedCapacity, setSelectedColor],
  );

  const handleCapacitySelect = useCallback(
    (cap: string) => {
      setSelectedCapacity(cap);
      onVariantChange(selectedColor, cap);
    },
    [onVariantChange, selectedColor, setSelectedCapacity],
  );

  return (
    <div className={s.info}>
      <div className={s.choices}>
        {!!data.colorsAvailable?.length && (
          <div className={s.row}>
            <div className={s.rowHead}>
              <span className={s.rowLabel}>Available colors</span>

              <span className={s.meta}>
                <span className={s.metaKey}>ID:</span>{' '}
                <code className={s.metaValue}>
                  {formatProductId(data.numericId)}
                </code>
              </span>
            </div>

            <div className={s.options}>
              {data.colorsAvailable.map(color => {
                const active = selectedColor === color;

                return (
                  <label
                    key={color}
                    className={optionClass(active)}
                    onPointerEnter={() =>
                      schedulePrefetch(color, selectedCapacity)
                    }
                    onPointerLeave={cancelPrefetch}
                  >
                    <input
                      type="radio"
                      name="color"
                      className={s.radio}
                      checked={active}
                      disabled={variantsPending}
                      onFocus={() => schedulePrefetch(color, selectedCapacity)}
                      onBlur={cancelPrefetch}
                      onChange={() => handleColorSelect(color)}
                    />
                    <span className={s.optionLabel}>{color}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <hr className={s.lines} />

        {!!data.capacityAvailable?.length && (
          <div className={s.row}>
            <span className={s.rowLabel}>Select capacity</span>

            <div className={s.options}>
              {data.capacityAvailable.map(cap => {
                const active = selectedCapacity === cap;

                return (
                  <label
                    key={cap}
                    className={optionClass(active)}
                    onPointerEnter={() => schedulePrefetch(selectedColor, cap)}
                    onPointerLeave={cancelPrefetch}
                  >
                    <input
                      type="radio"
                      name="capacity"
                      className={s.radio}
                      checked={active}
                      disabled={variantsPending}
                      onFocus={() => schedulePrefetch(selectedColor, cap)}
                      onBlur={cancelPrefetch}
                      onChange={() => handleCapacitySelect(cap)}
                    />
                    <span className={s.optionLabel}>{cap}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <hr className={s.lines} />
      </div>

      <div className={s.secondary}>
        <div className={s.prices}>
          {data.priceDiscount != null && (
            <div className={s.price}>${data.priceDiscount}</div>
          )}
          {data.priceRegular != null && (
            <div className={s.fullPrice}>${data.priceRegular}</div>
          )}
        </div>

        <div className={s.actions}>
          <Button
            variant={inCart ? 'secondary' : 'primary'}
            size="md"
            fullWidth={false}
            className={s.cartButton}
            onClick={handleAddToCart}
            disabled={inCart || variantsPending}
          >
            {inCart ? 'Added' : variantsPending ? 'Updating...' : 'Add to cart'}
          </Button>

          <FavoriteToggleButton
            active={favored}
            onToggle={handleToggleFavorite}
            className={s.favButton}
          />
        </div>
      </div>

      {specs.length > 0 && (
        <div className={s.specs}>
          {specs.map(spec => (
            <div key={spec.label} className={s.specRow}>
              <span className={s.specLabel}>{spec.label}</span>
              <span className={s.specValue}>{spec.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
