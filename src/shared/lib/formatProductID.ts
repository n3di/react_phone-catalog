// src/shared/lib/formatProductId.ts
export const formatProductId = (id?: number, width = 6): string => {
  if (typeof id !== 'number') {
    return '—';
  }

  return id.toString().padStart(width, '0');
};
