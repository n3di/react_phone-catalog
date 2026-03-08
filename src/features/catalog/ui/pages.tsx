// src/features/catalog/ui/pages.tsx
import { CatalogPage } from './CatalogPage';

export function PhonesPage() {
  return <CatalogPage category='phones' />
};

export function TabletsPage() {
  return <CatalogPage category='tablets' />;
};

export function AccessoriesPage() {
  return <CatalogPage category='accessories' />;
};
