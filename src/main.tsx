// src/main.tsx
import './app/styles/global.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/App';
import { ScrollToTop } from './app/router/ScrollToTop';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
