// src/widgets/footer/ui/Footer.tsx (albo gdzie to trzymasz)
import { arrowUp as ArrowUpIcon, logo as LogoIcon } from '@shared/assets/icons';
import { Container } from '@shared/ui/Container';
import { NavLink } from 'react-router-dom';

import s from './styles/Footer.module.scss';

export const Footer: React.FC = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={s.footer}>
      <Container className={s.container}>
        <NavLink to="/" aria-label="Go to home">
          <LogoIcon className={s.logo} aria-hidden="true" focusable="false" />
        </NavLink>

        <div className={s.linksContainer}>
          <a
            href="https://github.com/n3di/react_phone-catalog/tree/develop"
            className={s.links}
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>

          <a
            href="https://www.linkedin.com/in/michalszwindowski/"
            target="_blank"
            rel="noreferrer"
            className={s.links}
          >
            Contacts
          </a>

          <span className={s.links}>Rights</span>
        </div>

        <div className={s.returnContainer}>
          <p className={s.return}>Back to top</p>
          <button
            type="button"
            className={s.returnButton}
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            <ArrowUpIcon
              className={s.returnIcon}
              aria-hidden="true"
              focusable="false"
            />
          </button>
        </div>
      </Container>
    </footer>
  );
};
