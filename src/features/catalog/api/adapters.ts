// src/features/catalog/api/adapters.ts

type RawDetails = {
  id?: string;
  itemId?: string;
  image?: string;
  images?: string[];
  // inne pola zostawiamy w spokoju
  [key: string]: unknown;
};

type AdaptedDetails = RawDetails & {
  id: string;
  images: string[];
};

const normalizePath = (src?: string) => {
  if (!src) {
    return src;
  }

  if (src.startsWith('http')) {
    return src;
  }

  return src.startsWith('/') ? src : `/${src}`;
};

export const adaptDetails = (raw: RawDetails): AdaptedDetails => {
  const image = normalizePath(raw.image);

  const images: string[] = Array.isArray(raw.images)
    ? raw.images.map(path => normalizePath(path) ?? path)
    : image
      ? [image]
      : [];

  const id = raw.id ?? raw.itemId ?? '';

  return {
    ...raw,
    id,
    image,
    images,
  };
};
