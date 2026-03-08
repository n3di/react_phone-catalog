// src/widgets/header/model/useHeaderMenu.ts
import { useCallback, useEffect, useId, useRef, useState } from 'react';

const MOBILE_MAX = 639; // odpowiada @media (min-width: 640px)

function isMobileNow() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
}

function isElementFocusable(el: HTMLElement | null) {
  if (!el) return false;
  // offsetParent === null często oznacza display:none albo element poza layoutem
  return el.offsetParent !== null && !el.hasAttribute('disabled');
}

export function useHeaderMenu() {
  const menuId = useId();
  const burgerButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const closeMenuAndFocusTrigger = useCallback(() => {
    setIsMenuOpen(false);

    // Focus tylko jeśli burger jest realnie widoczny (czyli mobile)
    requestAnimationFrame(() => {
      const btn = burgerButtonRef.current;
      if (isMobileNow() && isElementFocusable(btn)) {
        btn?.focus();
      }
    });
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // ✅ AUTO-CLOSE przy przejściu na desktop
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_MAX + 1}px)`);

    const onChange = () => {
      if (mql.matches) {
        // na desktop menu ma być zawsze zamknięte
        setIsMenuOpen(false);
      }
    };

    // odpal też raz, gdyby ktoś odpalił stronę już na desktopie z open state
    onChange();

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // ✅ Scroll lock tylko na mobile i tylko gdy menu faktycznie otwarte
  useEffect(() => {
    if (!isMenuOpen) return;
    if (!isMobileNow()) return;

    const docEl = document.documentElement;
    const body = document.body;

    const prevOverflow = docEl.style.overflow;

    // kompensacja “skaczącego” layoutu po zniknięciu scrollbara
    docEl.style.overflow = 'hidden';

    return () => {
      docEl.style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    closeMenuAndFocusTrigger,
    burgerButtonRef,
    menuId,
  };
}
