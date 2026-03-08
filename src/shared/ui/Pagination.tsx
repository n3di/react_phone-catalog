// src/shared/ui/Pagination/Pagination.tsx
import s from './styles/Pagination.module.scss';

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<Props> = ({ page, pages, onPageChange }) => {
  if (pages <= 1) {
    return null;
  }

  const nums = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <nav className={s.pagination}>
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={s.arrow}
      >
        {'<'}
      </button>

      {nums.map(n => (
        <button
          key={n}
          type="button"
          aria-current={n === page}
          onClick={() => onPageChange(n)}
          className={n === page ? s.pageActive : s.page}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className={s.arrow}
      >
        {'>'}
      </button>
    </nav>
  );
};
