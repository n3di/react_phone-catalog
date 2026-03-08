// src/features/layout/model/navLinks.ts
import type { ComponentType, SVGProps } from 'react';
import { paths } from '@app/router/paths';
import { fav, order } from '@shared/assets/icons';

export type NavLinkConfig = {
  path: string;
  label: string;
  end?: boolean;
};

export type IconLinkKind = 'favorites' | 'cart';

// komponent SVG
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type IconLinkConfig = {
  path: string;
  Icon: IconComponent;
  alt: string;
  kind: IconLinkKind;
};

export const navLinks: NavLinkConfig[] = [
  { path: paths.home, label: 'Home', end: true },
  { path: paths.catalog.phones, label: 'Phones' },
  { path: paths.catalog.tablets, label: 'Tablets' },
  { path: paths.catalog.accessories, label: 'Accessories' },
];

export const iconLinks: IconLinkConfig[] = [
  {
    path: paths.favorites,
    Icon: fav,
    alt: 'favorites-icon',
    kind: 'favorites',
  },
  {
    path: paths.cart,
    Icon: order,
    alt: 'shopping-cart-icon',
    kind: 'cart',
  },
];
