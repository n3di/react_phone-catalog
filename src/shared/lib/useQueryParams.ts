import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useQueryParams<T extends Record<string, string | undefined>>() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const setParams = (patch: Partial<T>) => {
    const next = new URLSearchParams(location.search);

    (Object.keys(patch) as (keyof T)[]).forEach(key => {
      const value = patch[key];

      if (!value || value === '1' || value === 'all') {
        next.delete(String(key));
      } else {
        next.set(String(key), value);
      }
    });

    navigate({ search: next.toString() }, { replace: true });
  };

  return { params, setParams };
}
