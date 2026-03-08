// src/features/notFound/ui/NotFoundPage/NotFoundPage.tsx
import { paths } from '@app/router/paths';
import { Link } from 'react-router-dom';

import s from './styles/NotFoundPage.module.scss';

export default function NotFoundPage() {
  return (
    <section className={s.page}>
      <h1 className={s.title}>Page not found</h1>

      <p className={s.text}>
        The page you are looking for does not exist or has been moved.
      </p>

      <Link to={paths.home} className={s.link}>
        Go Home
      </Link>
    </section>
  );
};
