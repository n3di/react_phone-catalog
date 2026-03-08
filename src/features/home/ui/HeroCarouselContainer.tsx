import { paths } from '@app/router/paths';
import type { Category, Product } from '@features/catalog/model/types';
import { assetUrl } from '@shared/lib/assets';
import { useMemo } from 'react';

import type { HeroSlide } from './HeroCarousel';
import { HeroCarousel } from './HeroCarousel';

type Props = {
  products: Product[];
  intervalMs?: number;
};

function parseRamGb(ram?: string): number {
  if (!ram) return 0;
  const m = ram.match(/(\d+(?:\.\d+)?)\s*gb/i);
  return m ? Number(m[1]) : 0;
}

function parseScreenInches(screen?: string): number {
  if (!screen) return 0;
  const m = screen.match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function getDisplayPrice(p: Product): number {
  return p.fullPrice ?? p.price ?? 0;
}

function flagshipBoost(name: string): number {
  const n = name.toLowerCase();
  if (/\bultra\b/.test(n)) return 6;
  if (/\bpro\b/.test(n)) return 5;
  if (/\bmax\b/.test(n)) return 4;
  if (/\bplus\b/.test(n)) return 2;
  return 0;
}

function scoreProduct(p: Product, category: Category, maxYear: number): number {
  const year = p.year ?? 0;
  const price = getDisplayPrice(p);
  const ramGb = parseRamGb(p.ram);
  const screen = parseScreenInches(p.screen);

  const yearScore = year ? Math.max(0, year - (maxYear - 3)) : 0; // 0..3
  const priceScore = Math.log10(Math.max(1, price));
  const ramScore = Math.min(16, ramGb) / 2;
  const screenScore = screen ? Math.min(8, screen) / 2 : 0;

  const nameBoost = flagshipBoost(p.name);

  const weights =
    category === 'phones'
      ? { name: 2.4, price: 2.0, year: 2.2, ram: 1.2, screen: 0.4 }
      : category === 'tablets'
        ? { name: 1.4, price: 2.2, year: 2.0, ram: 1.0, screen: 0.6 }
        : { name: 0.3, price: 2.4, year: 1.8, ram: 0.4, screen: 0.2 };

  return (
    nameBoost * weights.name +
    priceScore * weights.price +
    yearScore * weights.year +
    ramScore * weights.ram +
    screenScore * weights.screen
  );
}

function pickFeatured(
  pool: Product[],
  category: Category,
): Product | undefined {
  if (!pool.length) return undefined;

  const maxYear = pool.reduce((m, p) => Math.max(m, p.year ?? 0), 0);

  const fresh = pool.filter(p => {
    if (!p.year) return true;
    return p.year >= maxYear - 3;
  });

  const candidates = fresh.length ? fresh : pool;

  let best = candidates[0];
  let bestScore = scoreProduct(best, category, maxYear);

  for (let i = 1; i < candidates.length; i++) {
    const p = candidates[i];
    const s = scoreProduct(p, category, maxYear);
    if (s > bestScore) {
      best = p;
      bestScore = s;
    }
  }

  return best;
}

const copyByCategory: Record<Category, { title: string; subtitle: string }> = {
  phones: {
    title: 'Now available in our store!',
    subtitle: 'Be the first!',
  },
  tablets: {
    title: "Don't wait, get it now!",
    subtitle: 'Get it yourself!',
  },
  accessories: {
    title: 'Only a few pieces left!',
    subtitle: 'Hurry up!',
  },
};

function buildSubtitle(p: Product) {
  const bits = [
    p.year ? String(p.year) : null,
    p.capacity ?? null,
    p.color ?? null,
  ].filter(Boolean);

  return bits.join(' • ');
}

export function HeroCarouselContainer({ products, intervalMs }: Props) {
  const items = useMemo<HeroSlide[]>(() => {
    const categories: Category[] = ['phones', 'tablets', 'accessories'];

    const slides: HeroSlide[] = [];

    for (const cat of categories) {
      const pool = products.filter(p => p.category === cat);
      const featured = pickFeatured(pool, cat);

      if (!featured) continue;

      const copy = copyByCategory[cat];

      slides.push({
        id: `${cat}-${featured.itemId}`,
        title: copy.title,
        subtitle: copy.subtitle,
        productName: featured.name,
        productSubtitle: buildSubtitle(featured),
        imageUrl: assetUrl(featured.image),
        ctaLabel: 'Order now',
        ctaTo: paths.productDetails(featured.itemId),
      });
    }

    return slides;
  }, [products]);

  if (!items.length) return null;

  return <HeroCarousel items={items} intervalMs={intervalMs ?? 10000} />;
}
