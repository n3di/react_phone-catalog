import type { Product } from '@features/catalog/model/types';
import { ProductCard } from '@features/catalog/ui/ProductCard';
import {
  arrowLeft as ArrowLeftIcon,
  arrowRight as ArrowRightIcon,
} from '@shared/assets/icons';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import s from './styles/ProductsSlider.module.scss';

type Props = {
  title: string;
  products: Product[];
};

const getStepCards = (width: number): number => {
  if (width >= 1200) return 4;
  if (width >= 900) return 3;
  if (width >= 640) return 2;
  return 1;
};

function getEdgePaddingPx(track: HTMLElement): number {
  const cs = window.getComputedStyle(track);

  // scroll-padding-left/right są wspierane w nowoczesnych przeglądarkach
  const left = parseFloat((cs as any).scrollPaddingLeft ?? '0') || 0;
  return left;
}

export const ProductsSlider: React.FC<Props> = ({ title, products }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const [stepCards, setStepCards] = useState(() =>
    typeof window === 'undefined' ? 1 : getStepCards(window.innerWidth),
  );

  const getCards = useCallback((): HTMLElement[] => {
    const track = trackRef.current;
    if (!track) return [];
    return Array.from(track.querySelectorAll<HTMLElement>('[data-card]'));
  }, []);

  const getSnapLeft = useCallback((track: HTMLElement, card: HTMLElement) => {
    const edge = getEdgePaddingPx(track);
    // snap-align: start + scroll-padding-inline = edge
    return Math.max(0, card.offsetLeft - edge);
  }, []);

  const getCurrentIndex = useCallback((): number => {
    const track = trackRef.current;
    if (!track) return 0;

    const cards = getCards();
    if (!cards.length) return 0;

    const scrollLeft = track.scrollLeft;

    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const target = getSnapLeft(track, cards[i]);
      const dist = Math.abs(scrollLeft - target);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    return bestIdx;
  }, [getCards, getSnapLeft]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const track = trackRef.current;
      if (!track) return;

      const cards = getCards();
      if (!cards.length) return;

      const nextIdx = Math.max(0, Math.min(idx, cards.length - 1));
      const left = getSnapLeft(track, cards[nextIdx]);

      track.scrollTo({ left, behavior: 'smooth' });
    },
    [getCards, getSnapLeft],
  );

  const updateArrows = useCallback(() => {
    const cards = getCards();
    if (!cards.length) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }

    const i = getCurrentIndex();
    setCanPrev(i > 0);
    setCanNext(i < cards.length - 1);
  }, [getCards, getCurrentIndex]);

  const handlePrev = useCallback(() => {
    const i = getCurrentIndex();
    scrollToIndex(i - stepCards);
  }, [getCurrentIndex, scrollToIndex, stepCards]);

  const handleNext = useCallback(() => {
    const i = getCurrentIndex();
    scrollToIndex(i + stepCards);
  }, [getCurrentIndex, scrollToIndex, stepCards]);

  useLayoutEffect(() => {
    // inicjalnie ustaw stan strzałek po renderze
    updateArrows();
  }, [products.length, updateArrows]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateArrows);
    };

    const onResize = () => {
      setStepCards(getStepCards(window.innerWidth));
      // po resize zmieniają się szerokości -> przelicz strzałki po klatce
      requestAnimationFrame(updateArrows);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // init
    setStepCards(getStepCards(window.innerWidth));
    updateArrows();

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [updateArrows]);

  if (!products.length) return null;

  return (
    <section className={s.section} aria-label={title}>
      <div className={s.sliderHeader}>
        <h2 className={s.category}>{title}</h2>

        <div className={s.buttonWrapper}>
          <button
            type="button"
            className={s.button}
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Previous products"
          >
            <ArrowLeftIcon
              className={s.icon}
              aria-hidden="true"
              focusable="false"
            />
          </button>

          <button
            type="button"
            className={s.button}
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Next products"
          >
            <ArrowRightIcon
              className={s.icon}
              aria-hidden="true"
              focusable="false"
            />
          </button>
        </div>
      </div>

      <div className={s.track} ref={trackRef}>
        {products.map(product => (
          <div key={product.id} className={s.item} data-card>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
