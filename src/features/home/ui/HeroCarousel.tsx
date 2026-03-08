import { SHOP_NAME } from '@shared/config/shopConfig';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import s from './styles/HeroCarousel.module.scss';

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  productName: string;
  productSubtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaTo: string;
};

type Props = {
  items: HeroSlide[];
  intervalMs?: number;
};

export const HeroCarousel = ({ items, intervalMs = 10000 }: Props) => {
  const [index, setIndex] = useState(0);
  const [imgReady, setImgReady] = useState(true);

  const timerRef = useRef<number | null>(null);
  const hasMany = items.length > 1;

  const clampIndex = useCallback(
    (value: number) => {
      if (!items.length) return 0;
      if (value < 0) return items.length - 1;
      if (value >= items.length) return 0;
      return value;
    },
    [items.length],
  );

  useEffect(() => {
    setIndex(prev => clampIndex(prev));
  }, [clampIndex]);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (!hasMany) return;
    if (!imgReady) return; // klucz: nie odpalaj zegara gdy obrazek jeszcze się ładuje

    timerRef.current = window.setTimeout(() => {
      setIndex(prev => clampIndex(prev + 1));
    }, intervalMs);
  }, [clearTimer, clampIndex, hasMany, intervalMs, imgReady]);

  useEffect(() => {
    scheduleNext();
    return clearTimer;
  }, [index, scheduleNext, clearTimer]);

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(clampIndex(nextIndex));
    },
    [clampIndex],
  );

  const handlePrev = () => goTo(index - 1);
  const handleNext = () => goTo(index + 1);
  const handleDotClick = (idx: number) => goTo(idx);

  const active = useMemo(() => items[index], [items, index]);

  // preload + decode aktywnego slajdu
  useEffect(() => {
    const src = active?.imageUrl;
    if (!src) return;

    let alive = true;
    setImgReady(false);

    const img = new Image();
    let settled = false;

    const done = () => {
      if (settled) return;
      settled = true;
      if (alive) setImgReady(true);
    };

    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
    img.src = src;

    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(done)
        .catch(() => {});
    }

    return () => {
      alive = false;
    };
  }, [active?.imageUrl]);

  // pauza gdy karta niewidoczna
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) clearTimer();
      else scheduleNext();
    };

    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [clearTimer, scheduleNext]);

  // pauza na hover (opcjonalnie, ale UX lepszy)
  const handleMouseEnter = () => clearTimer();
  const handleMouseLeave = () => scheduleNext();

  if (!items.length) return null;

  return (
    <section
      className={s.page}
      aria-label="Main promotions"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h1 className={s.titleblock}>Welcome to {SHOP_NAME}!</h1>

      <div className={s.block}>
        <div className={s.wrapper}>
          <button
            type="button"
            className={s.button}
            onClick={handlePrev}
            aria-label="Previous slide"
            disabled={!hasMany}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div className={s.carousel} aria-roledescription="carousel">
            <ul
              className={s.list}
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {items.map((item, idx) => (
                <li
                  key={item.id}
                  className={s.slide}
                  aria-hidden={idx !== index}
                >
                  <div className={s.carouselWrapper}>
                    <div className={s.carouselTextContainer}>
                      <div className={s.gap}>
                        <p className={s.title}>{item.title}</p>
                        <p className={s.subtitle}>{item.subtitle}</p>
                      </div>

                      <Link to={item.ctaTo} className={s.orderButton}>
                        {item.ctaLabel}
                      </Link>
                    </div>

                    <div className={s.productWrapper}>
                      <h3 className={s.productName}>{item.productName}</h3>
                      <h4 className={s.productSubtitle}>
                        {item.productSubtitle}
                      </h4>

                      <div
                        className={s.imageWrap}
                        data-loading={imgReady ? '0' : '1'}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className={s.image}
                          loading="eager"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className={s.srOnly} aria-live="polite">
              Showing: {active?.productName}
            </p>
          </div>

          <button
            type="button"
            className={s.button}
            onClick={handleNext}
            aria-label="Next slide"
            disabled={!hasMany}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className={s.dotsWrapper}>
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={idx === index ? s.dotActive : s.dot}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === index}
              onClick={() => handleDotClick(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
