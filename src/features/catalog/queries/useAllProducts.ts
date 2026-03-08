import { productsApi } from '@features/catalog/api/productsApi';
import { useQuery } from '@tanstack/react-query';

export function useAllProducts() {
  return useQuery({
    queryKey: ['products-all'],
    queryFn: ({ signal }) => productsApi.getAll(signal),
    staleTime: 10 * 60_000,
    gcTime: 60 * 60_000,
  });
}
