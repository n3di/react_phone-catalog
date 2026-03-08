// src/shared/ui/Button/Button.tsx
import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import s from './styles/Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isActive?: boolean; // np. do filtrow/sortowania
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isActive = false,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={classNames(
        s.button,
        s[variant],
        s[size],
        {
          [s.fullWidth]: fullWidth,
          [s.active]: isActive,
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
