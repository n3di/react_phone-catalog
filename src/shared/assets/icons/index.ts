// src/shared/assets/icons/index.ts
import type { ComponentType, SVGProps } from 'react';

import ArrowDownIcon from './ArrowDown.svg?react';
import ArrowLeftIcon from './ArrowLeft.svg?react';
import ArrowRightIcon from './ArrowRight.svg?react';
import ArrowUpIcon from './ArrowUp.svg?react';
import BurgerIcon from './Burger.svg?react';
import CloseIcon from './Close.svg?react';
import FavIcon from './Favourites.svg?react';
import FavFilledIcon from './FavouritesFilled.svg?react';
import HomeIcon from './Home.svg?react';
import Logo from './Logo.svg?react';
import MinusIcon from './Minus.svg?react';
import PlusIcon from './Plus.svg?react';
import CartIcon from './Shopping-bag.svg?react';

export type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const icons = {
  logo: Logo,
  order: CartIcon,
  fav: FavIcon,
  favFilled: FavFilledIcon,
  burger: BurgerIcon,
  close: CloseIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
  home: HomeIcon,
  minus: MinusIcon,
  plus: PlusIcon,
} as const;

export type IconKind = keyof typeof icons;

// **named exports** – TUTAJ MUSZĄ BYĆ, bo z nich korzystasz
export const logo: SvgIcon = Logo;
export const order: SvgIcon = CartIcon;
export const fav: SvgIcon = FavIcon;
export const favFilled: SvgIcon = FavFilledIcon;
export const burger: SvgIcon = BurgerIcon;
export const close: SvgIcon = CloseIcon;
export const arrowLeft: SvgIcon = ArrowLeftIcon;
export const arrowRight: SvgIcon = ArrowRightIcon;
export const arrowUp: SvgIcon = ArrowUpIcon;
export const arrowDown: SvgIcon = ArrowDownIcon;
export const home: SvgIcon = HomeIcon;
export const minus: SvgIcon = MinusIcon;
export const plus: SvgIcon = PlusIcon;
