import React, { memo, useEffect, useMemo, useState } from 'react';

import s from './styles/Gallery.module.scss';
import { assetUrl } from '@shared/lib/assets';

type Props = {
  variantKey: string;
  images: string[];
  name: string;
  imgIndex: number;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
  onVariantHeroReadyChange?: (ready: boolean) => void;
};

export const Gallery = memo(function Gallery({
  variantKey,
  images,
  name,
  imgIndex,
  setImgIndex,
  onVariantHeroReadyChange,
}: Props) {
  const safeIndex = Math.max(
    0,
    Math.min(imgIndex, Math.max(0, images.length - 1)),
  );

  const heroSrc = useMemo(() => {
    const src = images[safeIndex];
    return src ? assetUrl(src) : '';
  }, [images, safeIndex]);

  const [loaded, setLoaded] = useState(true);

  // preload dla HERO, ale overlay rodzica domyka się też na <img onLoad/onError>
  useEffect(() => {
    let alive = true;

    // start: hero niegotowy (tylko przy zmianie wariantu)
    onVariantHeroReadyChange?.(false);
    setLoaded(false);

    if (!heroSrc) {
      if (alive) {
        setLoaded(true);
        onVariantHeroReadyChange?.(true);
      }
      return () => {
        alive = false;
      };
    }

    const img = new Image();
    let settled = false;

    const doneOnce = () => {
      if (settled) return;
      settled = true;
      if (!alive) return;

      setLoaded(true);
      onVariantHeroReadyChange?.(true);
    };

    img.addEventListener('load', doneOnce, { once: true });
    img.addEventListener('error', doneOnce, { once: true });

    img.src = heroSrc;

    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(doneOnce)
        .catch(() => {
          // ignore
        });
    }

    // hard timeout: żeby nie wisieć w nieskończoność
    const t = window.setTimeout(doneOnce, 8000);

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
    // UWAGA: variantKey po to, żeby przy zmianie wariantu ten efekt ruszył od nowa
  }, [heroSrc, variantKey, onVariantHeroReadyChange]);

  const prev = () =>
    images.length && setImgIndex(i => (i - 1 + images.length) % images.length);

  const next = () => images.length && setImgIndex(i => (i + 1) % images.length);

  return (
    <div className={s.gallery}>
      {images.length > 0 && (
        <div className={s.hero}>
          {images.length > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className={`${s.heroArrow} ${s.heroArrowLeft}`}
            >
              ‹
            </button>
          )}

          <div className={s.heroMask}>
            <div
              className={s.heroPlaceholder}
              data-active={loaded ? 'false' : 'true'}
            />

            <img
              key={heroSrc}
              src={heroSrc}
              alt={name}
              className={
                loaded ? `${s.heroImage} ${s.heroImageLoaded}` : s.heroImage
              }
              width={442}
              height={442}
              loading="eager"
              onLoad={() => {
                setLoaded(true);
                onVariantHeroReadyChange?.(true);
              }}
              onError={() => {
                setLoaded(true);
                onVariantHeroReadyChange?.(true);
              }}
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className={`${s.heroArrow} ${s.heroArrowRight}`}
            >
              ›
            </button>
          )}
        </div>
      )}

      {images.length > 1 && (
        <div className={s.thumbs}>
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-current={i === safeIndex}
              onClick={() => setImgIndex(i)}
              className={i === safeIndex ? s.thumbActive : s.thumb}
            >
              <img src={assetUrl(src)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
