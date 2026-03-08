// src/shared/ui/Loader/Loader.tsx
import s from './styles/Loader.module.scss';

type Props = {
  /** Pełnoekranowa nakładka */
  fullScreen?: boolean;
  /** Tekst dla czytników ekranu */
  label?: string;
};

export const Loader: React.FC<Props> = ({
  fullScreen = false,
  label = 'Loading…',
}) => {
  return (
    <div
      className={fullScreen ? s.overlay : s.inline}
      role="status"
      aria-live="polite"
    >
      <div className={s.spinner} />
      <span className="visually-hidden">{label}</span>
    </div>
  );
};
