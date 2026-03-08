import { productsApi } from '@features/catalog/api/productsApi';
import type { Category, Product } from '@features/catalog/model/types';
import { ProductsList } from '@features/catalog/ui/ProductsList';
import { useQueryParams } from '@shared/lib/useQueryParams';
import { sortProducts } from '@shared/lib/utils';
import { Loader } from '@shared/ui/Loader';
import { Pagination } from '@shared/ui/Pagination';
import { useEffect, useMemo, useState } from 'react';

import s from './styles/CatalogPage.module.scss';

type SortKey = 'age' | 'title' | 'price';
type PerPage = '4' | '8' | '16' | 'all';

type QueryParams = {
  sort: SortKey | undefined;
  page: string | undefined;
  perPage: PerPage | undefined;
  query: string | undefined;
};

type Props = {
  category: Category;
};

export const CatalogPage: React.FC<Props> = ({ category }) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { params, setParams } = useQueryParams<QueryParams>();

  const sort: SortKey =
    ((params.get('sort') as SortKey | null) ?? 'age') || 'age';

  const page = Number(params.get('page') || '1');
  const perPage: PerPage =
    ((params.get('perPage') as PerPage | null) ?? 'all') || 'all';
  const query = (params.get('query') || '').trim();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    let cancelled = false;

    productsApi
      .getByCategory(category, controller.signal)
      .then(products => {
        if (cancelled) {
          return;
        }

        setData(products);
      })
      .catch(e => {
        if (cancelled) {
          return;
        }

        // ignorujemy abort requestu
        if (e instanceof DOMException && e.name === 'AbortError') {
          return;
        }

        setError(e instanceof Error ? e.message : 'Error');
      })
      .finally(() => {
        if (cancelled) {
          return;
        }

        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [category]);

  const filtered = useMemo(() => {
    let list = data;

    if (query) {
      const q = query.toLowerCase();

      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    return sortProducts(list, sort);
  }, [data, sort, query]);

  const total = filtered.length;
  const itemsPerPage = perPage === 'all' ? total || 1 : Number(perPage);
  const maxPage = Math.max(1, Math.ceil(total / itemsPerPage));
  const safePage = Math.min(page, maxPage);

  const paginated = useMemo(() => {
    if (perPage === 'all') {
      return filtered;
    }

    const from = (safePage - 1) * itemsPerPage;

    return filtered.slice(from, from + itemsPerPage);
  }, [filtered, perPage, safePage, itemsPerPage]);

  const title =
    category === 'phones'
      ? 'Phones'
      : category === 'tablets'
        ? 'Tablets'
        : 'Accessories';

  return (
    <section className={s.page}>
      <h1 className={s.h1}>{title} page</h1>

      <div className={s.controls}>
        <label className={s.control} htmlFor="catalog-sort">
          <span>Sort:</span>
          <select
            id="catalog-sort"
            name="sort"
            value={sort}
            onChange={e =>
              setParams({
                sort: e.target.value as SortKey,
                page: '1', // rozsądnie: reset strony po zmianie sortowania
              })
            }
            autoComplete="off"
          >
            <option value="age">Newest</option>
            <option value="title">Alphabetically</option>
            <option value="price">Cheapest</option>
          </select>
        </label>

        <label className={s.control} htmlFor="catalog-per-page">
          <span>Items on page:</span>
          <select
            id="catalog-per-page"
            name="perPage"
            value={perPage}
            onChange={e =>
              setParams({
                perPage: e.target.value as PerPage,
                page: '1',
              })
            }
            autoComplete="off"
          >
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="all">all</option>
          </select>
        </label>
      </div>

      {loading && <Loader />}

      {error && (
        <div className={s.error}>
          <p>Something went wrong</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )}

      {!loading && !error && !filtered.length && (
        <p className={s.empty}>
          There are no {category} {query ? 'matching the query' : 'yet'}.
        </p>
      )}

      {!loading && !error && !!paginated.length && (
        <>
          <ProductsList products={paginated} />

          {perPage !== 'all' && maxPage > 1 && (
            <Pagination
              page={safePage}
              pages={maxPage}
              onPageChange={p =>
                setParams({
                  page: String(p),
                })
              }
            />
          )}
        </>
      )}
    </section>
  );
};
