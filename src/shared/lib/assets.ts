export const assetUrl = (path: string): string => {
  if (!path) return '';

  // absolute http(s)
  if (/^https?:\/\//i.test(path)) return path;

  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, ''); // "/shop" albo ""
  const clean = path.replace(/^\/+/, ''); // "img/...."

  // jeśli ktoś już podał ścieżkę z base (np. "/shop/img/...") to nie doklejaj drugi raz
  if (base && (path === base || path.startsWith(`${base}/`))) {
    return path;
  }

  // base == "" oznacza "/"
  return `${base}/${clean}`.replace(/\/{2,}/g, '/');
};
