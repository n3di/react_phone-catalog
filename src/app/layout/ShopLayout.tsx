// src/app/layout/ShopLayout.tsx
import { SHOP_NAME } from '@shared/config/shopConfig';
import { Container } from '@shared/ui/Container';
import { Footer } from '@widgets/footer/ui/Footer';
import { Header } from '@widgets/header/ui/Header';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import s from './styles/ShopLayout.module.scss';

const title = `${SHOP_NAME}`;
const description = `${SHOP_NAME} – browse phones, tablets and accessories.`;

export function ShopLayout() {
  return (
    <div className="app">
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <main className={s.main__app}>
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  );
};
