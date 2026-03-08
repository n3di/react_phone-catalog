import { Product } from '@features/catalog/model/types';

export function sortProducts(list: Product[], sort: 'age' | 'title' | 'price') {
  const copy = [...list];

  switch (sort) {
    case 'age':
      return copy.sort((a, b) => b.year - a.year);
    case 'title':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'price':
      return copy.sort((a, b) => a.price - b.price);
    default:
      return list;
  }
}
