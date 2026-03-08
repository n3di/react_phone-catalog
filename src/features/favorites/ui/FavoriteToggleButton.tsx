import {
  fav as FavIcon,
  favFilled as FavFilledIcon,
} from '@shared/assets/icons';
import { IconButton } from '@shared/ui/IconButton';
import classNames from 'classnames';

import s from './styles/FavoriteToggleButton.module.scss';

type Size = 'md' | 'sm';

type Props = {
  active: boolean;
  onToggle: () => void;
  className?: string;
  size?: Size;
};

export const FavoriteToggleButton: React.FC<Props> = ({
  active,
  onToggle,
  className,
  size = 'md',
}) => {
  const Icon = active ? FavFilledIcon : FavIcon;

  return (
    <IconButton
      size={size}
      className={classNames(
        s.favButton,
        { [s.favButtonActive]: active },
        className,
      )}
      aria-pressed={active}
      onClick={onToggle}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Icon className={s.favIcon} aria-hidden="true" focusable="false" />
    </IconButton>
  );
};
