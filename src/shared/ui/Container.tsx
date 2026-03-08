// src/shared/ui/Container/Container.tsx
import classNames from 'classnames';
import type { ReactNode } from 'react';

import s from './styles/Container.module.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

export const Container: React.FC<Props> = ({ children, className }) => {
  return <div className={classNames(s.container, className)}>{children}</div>;
};
