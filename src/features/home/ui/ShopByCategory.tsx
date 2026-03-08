import { paths } from '@app/router/paths';
import { Link } from 'react-router-dom';

import s from './styles/ShopByCategory.module.scss';
import { assetUrl } from '@shared/lib/assets';

type CategoryType = 'phones' | 'tablets' | 'accessories';

type CategoryCardProps = {
  title: string;
  to: string;
  imgSrc: string;
  count: number | null;
  type: CategoryType;
  imageClassName?: string;
};

type Props = {
  phonesCount: number | null;
  tabletsCount: number | null;
  accessoriesCount: number | null;
};

export const ShopByCategory = ({
  phonesCount,
  tabletsCount,
  accessoriesCount,
}: Props) => {
  const categories: CategoryCardProps[] = [
    {
      title: 'Mobile phones',
      to: paths.catalog.phones,
      imgSrc: '/img/category-phones.webp',
      count: phonesCount,
      type: 'phones',
      imageClassName: s.imagePhones,
    },
    {
      title: 'Tablets',
      to: paths.catalog.tablets,
      imgSrc: '/img/category-tablets.png',
      count: tabletsCount,
      type: 'tablets',
      imageClassName: s.imageTablets,
    },
    {
      title: 'Accessories',
      to: paths.catalog.accessories,
      imgSrc: '/img/category-accessories.webp',
      count: accessoriesCount,
      type: 'accessories',
      imageClassName: s.imageAccessories,
    },
  ];

  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>Shop by category</h2>

      <div className={s.grid}>
        {categories.map(cat => (
          <CategoryCard key={cat.to} {...cat} />
        ))}
      </div>
    </section>
  );
};

const CategoryCard = ({
  title,
  to,
  imgSrc,
  count,
  type,
  imageClassName,
}: CategoryCardProps) => {
  const bgClass =
    type === 'phones'
      ? s.categoryPhones
      : type === 'tablets'
        ? s.categoryTablets
        : s.categoryAccessories;

  return (
    <Link to={to} className={s.card}>
      <div className={`${s.imageWrap} ${bgClass}`}>
        <img
          src={assetUrl(imgSrc)}
          alt={title}
          className={`${s.image} ${imageClassName ?? ''}`}
        />
      </div>

      <div className={s.body}>
        <h3 className={s.name}>{title}</h3>
        <p className={s.count}>{count === null ? '—' : `${count} models`}</p>
      </div>
    </Link>
  );
};
