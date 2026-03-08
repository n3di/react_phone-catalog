import { useLocalStorage } from '@shared/lib/useLocalStorage';
import { createContext, useContext, useMemo } from 'react';

type FavState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  count: number;
};

const Ctx = createContext<FavState | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>('favorites', []);

  const api = useMemo(() => {
    const toggle = (id: string) =>
      setIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
      );
    const has = (id: string) => ids.includes(id);
    const count = ids.length;

    return { ids, toggle, has, count };
  }, [ids, setIds]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useFavorites = () => {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return ctx;
};
