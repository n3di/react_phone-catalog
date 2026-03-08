export const paths = {
  home: '/',
  catalog: {
    phones: '/phones',
    tablets: '/tablets',
    accessories: '/accessories',
  },
  productDetails: (id = ':productId') => `/product/${id}`,
  cart: '/cart',
  favorites: '/favorites',
} as const;

