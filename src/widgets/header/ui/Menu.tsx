// src/widgets/header/ui/Menu.tsx
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';

import { iconLinks, navLinks } from '../model/navLinks';
import s from './styles/Menu.module.scss';

type MenuProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  favoritesCount: number;
  cartCount: number;
};

export function Menu({
  id,
  isOpen,
  onClose,
  favoritesCount,
  cartCount,
}: MenuProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelectors),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || focusable.length === 0) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuClasses = classNames(s.menu, { [s.active]: isOpen });

  const getMenuNavClass = ({ isActive }: { isActive: boolean }) =>
    classNames(s.menuNav, { [s.menuNavActive]: isActive });

  const getMenuIconClass = ({ isActive }: { isActive: boolean }) =>
    classNames(s.menuIcons, { [s.menuIconsActive]: isActive });

  const content = (
    <div className={s.backdrop} onMouseDown={onClose} aria-hidden="true">
      <div
        id={id}
        ref={dialogRef}
        className={menuClasses}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        onMouseDown={e => e.stopPropagation()} // nie zamykaj gdy klikniesz wewnątrz
      >
        <div className={s.menuNavContainer}>
          {navLinks.map(({ path, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={getMenuNavClass}
              onClick={onClose}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className={s.menuIconsContainer}>
          {iconLinks.map(({ path, Icon, alt, kind }) => {
            const badgeCount =
              kind === 'favorites' ? favoritesCount : cartCount;

            return (
              <NavLink
                key={path}
                to={path}
                aria-label={alt}
                className={getMenuIconClass}
                onClick={onClose}
              >
                <span className={s.menuIconWrapper}>
                  <Icon
                    className={s.menuImages}
                    aria-hidden="true"
                    focusable="false"
                  />
                  {badgeCount > 0 && (
                    <span className={s.menuBadge}>{badgeCount}</span>
                  )}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
