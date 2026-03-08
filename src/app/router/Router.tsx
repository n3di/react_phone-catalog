// src/app/router/Router.tsx
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ShopLayout } from '@app/layout/ShopLayout';
import { ShopProviders } from '@app/providers/ShopProviders';
import { paths } from '@app/router/paths';
import { Loader } from '@shared/ui/Loader';

const HomePage = lazy(() => import('@features/home/ui/HomePage'));
const PhonesPage = lazy(() =>
  import('@features/catalog/ui/pages').then(m => ({ default: m.PhonesPage })),
);
const TabletsPage = lazy(() =>
  import('@features/catalog/ui/pages').then(m => ({ default: m.TabletsPage })),
);
const AccessoriesPage = lazy(() =>
  import('@features/catalog/ui/pages').then(m => ({
    default: m.AccessoriesPage,
  })),
);
const CartPage = lazy(() => import('@features/cart/ui/CartPage'));
const FavoritesPage = lazy(() => import('@features/favorites/ui/FavoritesPage'));
const ProductDetailsPage = lazy(() => import('@features/productDetails/ui/ProductDetailsPage'));
const NotFoundPage = lazy(() => import('@features/notFound/ui/NotFoundPage'));


export const Router = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* GAŁĄŹ SKLEPOWA */}
      <Route
        path={paths.home}
        element={
          <ShopProviders>
            <ShopLayout />
          </ShopProviders>
        }
      >
        <Route index element={<HomePage />} />
        <Route path={paths.catalog.phones} element={<PhonesPage />} />
        <Route path={paths.catalog.tablets} element={<TabletsPage />} />
        <Route path={paths.catalog.accessories} element={<AccessoriesPage />} />
        <Route path={paths.productDetails()} element={<ProductDetailsPage />} />
        <Route path={paths.cart} element={<CartPage />} />
        <Route path={paths.favorites} element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);
