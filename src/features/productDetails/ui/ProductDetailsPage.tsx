import { useEffect, useMemo, useState } from 'react';

import { paths } from '@app/router/paths';
import { useCart } from '@features/cart/model/CartContext';
import type { CartProduct } from '@features/cart/model/types';
import type { Category } from '@features/catalog/model/types';
import { useFavorites } from '@features/favorites/model/FavoritesContext';
import { ProductsSlider } from '@features/home/ui/ProductsSlider';
import { useProductDetails } from '@features/productDetails/model/useProductDetails';
import { SHOP_NAME, SITE_URL } from '@shared/config/shopConfig';
import { Loader } from '@shared/ui/Loader';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Gallery } from './Gallery';
import { InfoPanel } from './InfoPanel';
import { ProductDetailsSkeleton } from './ProductDetailsSkeleton';
import s from './styles/ProductDetailsPage.module.scss';

type RouteParams = { productId?: string };

const categoryTitleMap: Record<Category, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

const categoryPathMap: Record<Category, string> = {
  phones: paths.catalog.phones,
  tablets: paths.catalog.tablets,
  accessories: paths.catalog.accessories,
};

type SpecRow = { label: string; value: string };

type SpecsSource = {
  screen?: string;
  resolution?: string;
  processor?: string;
  ram?: string;
  capacity?: string;
  camera?: string;
  zoom?: string;
  cell?: string[];
};

const buildSpecs = (data: SpecsSource): SpecRow[] => {
  const specs: SpecRow[] = [];

  if (data.screen) specs.push({ label: 'Screen', value: data.screen });
  if (data.resolution)
    specs.push({ label: 'Resolution', value: data.resolution });
  if (data.processor) specs.push({ label: 'Processor', value: data.processor });
  if (data.ram) specs.push({ label: 'RAM', value: data.ram });
  if (data.capacity)
    specs.push({ label: 'Built in memory', value: data.capacity });
  if (data.camera) specs.push({ label: 'Camera', value: data.camera });
  if (data.zoom) specs.push({ label: 'Zoom', value: data.zoom });

  if (Array.isArray(data.cell) && data.cell.length > 0) {
    specs.push({ label: 'Cell', value: data.cell.join(' ') });
  }

  return specs;
};

type JsonLdProduct = {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  image?: string[];
  description?: string;
  sku?: string;
  category?: Category;
  offers?:
    | {
        '@type': 'Offer';
        price: string;
        priceCurrency: string;
        url?: string;
        availability?: string;
      }
    | undefined;
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const normalizePath = (src?: string): string | undefined => {
  if (!src) return undefined;
  if (isAbsoluteUrl(src)) return src;
  return src.startsWith('/') ? src : `/${src}`;
};

const buildAbsoluteUrl = (base: string, path?: string): string | undefined => {
  if (!path) return undefined;
  if (isAbsoluteUrl(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/+$/, '')}${normalized}`;
};

export default function ProductDetailsPage() {
  const { productId = '' } = useParams<RouteParams>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data,
    suggested,
    loading,
    err,
    images,
    imgIndex,
    setImgIndex,
    selectedColor,
    setSelectedColor,
    selectedCapacity,
    setSelectedCapacity,
    onVariantChange,
    prefetchVariant,
    isPending,
    // isFetching możesz dalej zwracać w hooku, ale NIE wiąż overlay z isFetching.
    // bo to jest "background work" i będzie Ci robić wiszący loader.
  } = useProductDetails(productId);

  const { add, items } = useCart();
  const { has, toggle } = useFavorites();

  // Steruje overlay dla "wariant zmieniony, hero jeszcze niegotowy"
  const [variantHeroReady, setVariantHeroReady] = useState(true);

  // Każda zmiana route = nowy wariant -> czekamy na hero
  useEffect(() => {
    setVariantHeroReady(false);
  }, [productId]);

  const specs = useMemo<SpecRow[]>(() => {
    if (!data) return [];
    return buildSpecs({
      screen: data.screen,
      resolution: data.resolution,
      processor: data.processor,
      ram: data.ram,
      capacity: data.capacity,
      camera: data.camera,
      zoom: data.zoom,
      cell: data.cell,
    });
  }, [
    data?.screen,
    data?.resolution,
    data?.processor,
    data?.ram,
    data?.capacity,
    data?.camera,
    data?.zoom,
    data?.cell?.length,
    data?.cell?.join('|'),
  ]);

  // initial-only skeleton
  if (loading && !data) return <ProductDetailsSkeleton />;
  if (err || !data) return <p className={s.error}>Product was not found</p>;

  const p = data;

  const safeIndex = Math.max(
    0,
    Math.min(imgIndex, Math.max(0, images.length - 1)),
  );

  const primaryImageLocal = normalizePath(
    images[safeIndex] ?? images[0] ?? p.image,
  );

  const productForCart: CartProduct = {
    itemId: p.id,
    name: p.name,
    price: p.priceDiscount ?? p.priceRegular ?? 0,
    image: primaryImageLocal ?? '',
  };

  const inCart = Array.isArray(items)
    ? items.some(i => i.product.itemId === p.id)
    : false;
  const favored = typeof has === 'function' ? !!has(p.id) : false;

  const handleAddToCart = () => add(productForCart);
  const handleToggleFavorite = () => toggle?.(p.id);

  const categoryPath = categoryPathMap[p.category];
  const categoryTitle = categoryTitleMap[p.category];

  const canonicalUrl =
    buildAbsoluteUrl(SITE_URL, location.pathname) ?? SITE_URL;
  const imgUrl =
    primaryImageLocal && buildAbsoluteUrl(SITE_URL, primaryImageLocal);

  const priceForSeo = p.priceDiscount ?? p.priceRegular ?? undefined;
  const currency = 'USD';

  const aboutFirst =
    p.description?.[0]?.text?.[0] ??
    ([p.screen, p.processor, p.ram, p.capacity].filter(Boolean).join(' • ') ||
      `${p.name} - check full specs, photos and price.`);

  const title = `${p.name} | ${SHOP_NAME} store`;

  const jsonLd: JsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: imgUrl ? [imgUrl] : undefined,
    description: aboutFirst,
    sku: p.id ?? productId,
    category: p.category,
    offers: priceForSeo
      ? {
          '@type': 'Offer',
          price: String(priceForSeo),
          priceCurrency: currency,
          url: canonicalUrl,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  };

  // ✅ overlay tylko gdy to ma sens dla UX:
  // - zmiana route vs aktualnie renderowane dane (data.id != productId)
  // - transition
  // - hero dla nowego wariantu nie jest gotowy
  const routeMismatch = p.id !== productId;
  const isTopPending = routeMismatch || isPending || !variantHeroReady;

  return (
    <section className={s.page}>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={aboutFirst} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={p.name} />
        <meta property="og:description" content={aboutFirst} />
        <meta property="og:url" content={canonicalUrl} />
        {imgUrl && <meta property="og:image" content={imgUrl} />}
        {priceForSeo && (
          <meta property="product:price:amount" content={String(priceForSeo)} />
        )}
        {priceForSeo && (
          <meta property="product:price:currency" content={currency} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={p.name} />
        <meta name="twitter:dePscription" content={aboutFirst} />
        {imgUrl && <meta name="twitter:image" content={imgUrl} />}

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <nav className={s.breadcrumbs}>
        <Link to={paths.home} className={s.breadcrumbLink}>
          Home
        </Link>
        <span className={s.breadcrumbSep}>/</span>
        <Link to={categoryPath} className={s.breadcrumbLink}>
          {categoryTitle}
        </Link>
        <span className={s.breadcrumbSep}>/</span>
        <span className={s.breadcrumbCurrent}>{p.name}</span>
      </nav>

      <button type="button" onClick={() => navigate(-1)} className={s.back}>
        Back
      </button>

      <h1 className={s.pageTitle}>{p.name}</h1>

      <div className={s.topWrap} aria-busy={isTopPending ? 'true' : 'false'}>
        <div
          className={s.topOverlay}
          data-active={isTopPending ? 'true' : 'false'}
          aria-hidden={isTopPending ? 'false' : 'true'}
        >
          <Loader />
        </div>

        <div className={s.top}>
          <Gallery
            variantKey={productId}
            images={images}
            name={p.name}
            imgIndex={safeIndex}
            setImgIndex={setImgIndex}
            onVariantHeroReadyChange={setVariantHeroReady}
          />

          <InfoPanel
            data={p}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedCapacity={selectedCapacity}
            setSelectedCapacity={setSelectedCapacity}
            onVariantChange={onVariantChange}
            onVariantPrefetch={prefetchVariant}
            variantsPending={isTopPending}
            inCart={inCart}
            handleAddToCart={handleAddToCart}
            favored={favored}
            handleToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      <section className={s.details}>
        {!!p.description?.length && (
          <div className={s.aboutCol}>
            <h2 className={s.aboutTitle}>About</h2>
            <hr className={s.lines} />
            <div className={s.aboutContent}>
              {p.description.map((block, bi) => (
                <div key={`${block.title}-${bi}`} className={s.aboutBlock}>
                  <h3 className={s.aboutBlockTitle}>{block.title}</h3>
                  {block.text.map((t: string, i: number) => (
                    <p key={`${bi}-${i}`} className={s.aboutText}>
                      {t}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {specs.length > 0 && (
          <aside className={s.specsCol} aria-label="Technical specifications">
            <h2 className={s.specsTitle}>Tech specs</h2>
            <hr className={s.lines} />
            <dl className={s.specsList}>
              {specs.map(spec => (
                <div key={spec.label} className={s.specsRow}>
                  <dt className={s.specsLabel}>{spec.label}</dt>
                  <dd className={s.specsValue}>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </section>

      <section className={s.suggested}>
        <ProductsSlider title="You may also like" products={suggested} />
      </section>
    </section>
  );
}
