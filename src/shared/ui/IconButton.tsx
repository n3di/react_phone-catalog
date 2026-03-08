import classNames from 'classnames';

import s from './styles/IconButton.module.scss';

type Size = 'md' | 'sm';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Size;
};

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    className={classNames(s.iconButton, s[`iconButton--${size}`], className)}
    {...rest}
  >
    {children}
  </button>
);
