import { paths } from '@app/router/paths';
import { productsApi } from '@features/catalog/api/productsApi';
import type { Product, ProductDetails } from '@features/catalog/model/types';
import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const buildVariantSlug = (
  namespaceId: string,
  capacity: string,
  color: string,
) => {
  const colorSlug = color.toLowerCase().replace(/\s+/g, '-');
  const capacitySlug = capacity.toLowerCase();
  return `${namespaceId}-${capacitySlug}-${colorSlug}`;
};

type UseProductDetailsResult = {
  data: ProductDetails | null;
  suggested: Product[];
  loading: boolean;
  err: string | null;
  images: string[];
  imgIndex: number;
  setImgIndex: Dispatch<SetStateAction<number>>;
  selectedColor: string | null;
  setSelectedColor: Dispatch<SetStateAction<string | null>>;
  selectedCapacity: string | null;
  setSelectedCapacity: Dispatch<SetStateAction<string | null>>;
  onVariantChange: (
    nextColor: string | null,
    nextCapacity: string | null,
  ) => void;
  prefetchVariant: (
    nextColor: string | null,
    nextCapacity: string | null,
  ) => void;
  isPending: boolean;
  isFetching: boolean;
};

const DETAILS_STALE = 5 * 60_000;

export function useProductDetails(productId: string): UseProductDetailsResult {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imgIndex, setImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const isNumeric = /^\d+$/.test(productId);

  const mapQuery = useQuery({
    queryKey: ['product-map', productId],
    enabled: isNumeric,
    queryFn: ({ signal }) =>
      productsApi.findItemIdByNumericId(Number(productId), signal),
    staleTime: DETAILS_STALE,
    gcTime: 30 * 60_000,
  });

  useEffect(() => {
    if (!isNumeric) return;
    if (mapQuery.isFetched && mapQuery.data) {
      navigate(paths.productDetails(mapQuery.data), { replace: true });
    }
  }, [isNumeric, mapQuery.isFetched, mapQuery.data, navigate]);

  const detailsQuery = useQuery({
    queryKey: ['product-details', productId],
    enabled: !isNumeric,
    queryFn: ({ signal }) => productsApi.getDetails(productId, signal),
    placeholderData: keepPreviousData,
    staleTime: DETAILS_STALE,
    gcTime: 30 * 60_000,
  });

  const suggestedQuery = useQuery({
    queryKey: ['product-suggested', productId],
    enabled: !isNumeric,
    queryFn: ({ signal }) => productsApi.getSuggested(productId, signal),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const data = detailsQuery.data ?? null;

  useEffect(() => {
    if (!data) return;

    const colors = data.colorsAvailable ?? [];
    const caps = data.capacityAvailable ?? [];

    setSelectedColor(prev => {
      if (prev && colors.includes(prev)) return prev;
      return data.color ?? colors[0] ?? null;
    });

    setSelectedCapacity(prev => {
      if (prev && caps.includes(prev)) return prev;
      return data.capacity ?? caps[0] ?? null;
    });

    setImgIndex(0);
  }, [
    data?.id,
    data?.color,
    data?.capacity,
    data?.colorsAvailable,
    data?.capacityAvailable,
  ]);

  const images = useMemo(() => {
    if (!data) return [];
    if (data.images?.length) return data.images;
    if (data.image) return [data.image];
    return [];
  }, [data]);

  const prefetchVariant = (
    nextColor: string | null,
    nextCapacity: string | null,
  ) => {
    if (!data?.namespaceId || !nextColor || !nextCapacity) return;

    const newId = buildVariantSlug(data.namespaceId, nextCapacity, nextColor);
    if (newId === productId) return;

    // ✅ jeśli już jest w cache react-query, nie rób requestu
    const cached = queryClient.getQueryData<ProductDetails>([
      'product-details',
      newId,
    ]);
    if (cached) return;

    void queryClient.prefetchQuery({
      queryKey: ['product-details', newId],
      queryFn: ({ signal }) => productsApi.getDetails(newId, signal),
      staleTime: DETAILS_STALE,
    });

    // Suggested NIE prefetchnij na hover - to czysty spam.
  };

  const onVariantChange = (
    nextColor: string | null,
    nextCapacity: string | null,
  ) => {
    if (!data?.namespaceId || !nextColor || !nextCapacity) return;

    const newId = buildVariantSlug(data.namespaceId, nextCapacity, nextColor);
    if (newId === productId) return;

    prefetchVariant(nextColor, nextCapacity);

    startTransition(() => {
      navigate(paths.productDetails(newId), { replace: false });
    });
  };

  const loading =
    (isNumeric && mapQuery.isLoading) ||
    (!isNumeric && detailsQuery.isLoading && !detailsQuery.data);

  const err = (() => {
    if (isNumeric) {
      if (mapQuery.isError) {
        return mapQuery.error instanceof Error
          ? mapQuery.error.message
          : 'Error';
      }
      if (mapQuery.isFetched && !mapQuery.data) return 'Product not found';
      return null;
    }

    if (detailsQuery.isError) {
      return detailsQuery.error instanceof Error
        ? detailsQuery.error.message
        : 'Error';
    }

    return null;
  })();

  const isFetching =
    (!isNumeric && detailsQuery.isFetching) ||
    (!isNumeric && suggestedQuery.isFetching);

  return {
    data,
    suggested: (suggestedQuery.data as Product[]) ?? [],
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
    isFetching,
  };
}
