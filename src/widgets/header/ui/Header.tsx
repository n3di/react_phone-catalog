// src/widgets/header/ui/Header.tsx
import { paths } from '@app/router/paths';
import { useCart } from '@features/cart/model/CartContext';
import { useFavorites } from '@features/favorites/model/FavoritesContext';
import {
  burger as BurgerIcon,
  close as CloseIcon,
  logo as LogoIcon,
} from '@shared/assets/icons';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import { iconLinks, navLinks } from '../model/navLinks';
import { useHeaderMenu } from '../model/useHeaderMenu';
import { Menu } from './Menu';
import s from './styles/Header.module.scss';

export function Header() {
  const { totalQty } = useCart();
  const { count } = useFavorites();

  const {
    isMenuOpen,
    toggleMenu,
    closeMenuAndFocusTrigger,
    burgerButtonRef,
    menuId,
  } = useHeaderMenu();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    classNames(s.primaryLink, { [s.primaryLinkActive]: isActive });

  const getIconClass = ({ isActive }: { isActive: boolean }) =>
    classNames(s.iconLink, { [s.iconLinkActive]: isActive });

  return (
    <>
      <header className={s.header}>
        <div className={s.inner}>
          <div className={s.left}>
            <Link to={paths.home} aria-label="Go to home">
              <LogoIcon
                className={s.logo}
                aria-hidden="true"
                focusable="false"
              />
            </Link>

            <nav className={s.primaryNav} aria-label="Primary navigation">
              {navLinks.map(({ path, label, end }) => (
                <NavLink key={path} to={path} end={end} className={getNavClass}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <nav className={s.secondary} aria-label="User navigation">
            {iconLinks.map(({ path, Icon, alt, kind }) => {
              const badgeCount = kind === 'favorites' ? count : totalQty;

              return (
                <NavLink
                  key={path}
                  to={path}
                  aria-label={alt}
                  className={getIconClass}
                >
                  <span className={s.iconWrapper}>
                    <Icon
                      className={s.icon}
                      aria-hidden="true"
                      focusable="false"
                    />
                    {badgeCount > 0 && (
                      <span className={s.badge}>{badgeCount}</span>
                    )}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          <div className={s.burger}>
            <button
              type="button"
              aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              className={s.burgerButton}
              onClick={toggleMenu}
              ref={burgerButtonRef}
            >
              {isMenuOpen ? (
                <CloseIcon
                  className={s.burgerIcon}
                  aria-hidden="true"
                  focusable="false"
                />
              ) : (
                <BurgerIcon
                  className={s.burgerIcon}
                  aria-hidden="true"
                  focusable="false"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      <Menu
        id={menuId}
        isOpen={isMenuOpen}
        onClose={closeMenuAndFocusTrigger}
        favoritesCount={count}
        cartCount={totalQty}
      />
    </>
  );
}
