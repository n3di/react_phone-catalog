// src/shared/ui/Icon/Icon.tsx
import { type IconKind, icons } from '@shared/assets/icons';

type Props = {
  kind: IconKind;
  className?: string;
} & React.SVGProps<SVGSVGElement>;

export function Icon({ kind, className, ...rest }: Props) {
  const Svg = icons[kind];

  return <Svg className={className} {...rest} />;
}
