// src/features/productDetails/ui/ProductDetailsSkeleton.tsx
import s from './styles/ProductDetailsPage.module.scss';

export const ProductDetailsSkeleton = () => {
  return (
    <section className={`${s.page} ${s.pageSkeleton}`} aria-busy="true">
      {/* Breadcrumbs */}
      <nav className={s.breadcrumbs}>
        <span
          className={`${s.skeleton} ${s.skeletonText} ${s.breadcrumbItem}`}
        />
        <span className={s.breadcrumbSep}>/</span>
        <span
          className={`${s.skeleton} ${s.skeletonText} ${s.breadcrumbItem}`}
        />
        <span className={s.breadcrumbSep}>/</span>
        <span
          className={`${s.skeleton} ${s.skeletonText} ${s.breadcrumbItemWide}`}
        />
      </nav>

      {/* Back button */}
      <button
        type="button"
        className={`${s.back} ${s.skeleton} ${s.skeletonText}`}
      />

      {/* Title */}
      <div className={`${s.pageTitle} ${s.skeleton} ${s.skeletonTitle}`} />

      {/* Góra: galeria + panel info */}
      <div className={s.top}>
        {/* Galeria */}
        <div className={s.gallerySkeleton}>
          <div className={`${s.skeleton} ${s.heroSkeleton}`} />
          <div className={s.thumbsSkeleton}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${s.skeleton} ${s.thumbSkeleton}`} />
            ))}
          </div>
        </div>

        {/* Panel info */}
        <div className={s.infoSkeleton}>
          {/* Colors row */}
          <div className={s.infoRowSkeleton}>
            <div className={`${s.skeleton} ${s.infoLabelSkeleton}`} />
            <div className={s.optionsSkeleton}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${s.skeleton} ${s.optionSkeleton}`} />
              ))}
            </div>
          </div>

          {/* Capacity row */}
          <div className={s.infoRowSkeleton}>
            <div className={`${s.skeleton} ${s.infoLabelSkeleton}`} />
            <div className={s.optionsSkeleton}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`${s.skeleton} ${s.optionSkeleton}`} />
              ))}
            </div>
          </div>

          {/* Prices */}
          <div className={s.pricesSkeleton}>
            <div className={`${s.skeleton} ${s.priceSkeleton}`} />
            <div className={`${s.skeleton} ${s.fullPriceSkeleton}`} />
          </div>

          {/* Buttons */}
          <div className={s.actionsSkeleton}>
            <div className={`${s.skeleton} ${s.buttonSkeleton}`} />
            <div className={`${s.skeleton} ${s.iconButtonSkeleton}`} />
          </div>

          {/* Short specs (np. screen, CPU) */}
          <div className={s.shortSpecsSkeleton}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={s.shortSpecRowSkeleton}>
                <div className={`${s.skeleton} ${s.shortSpecLabel}`} />
                <div className={`${s.skeleton} ${s.shortSpecValue}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About + Tech specs */}
      <section className={s.details}>
        {/* ABOUT */}
        <div className={s.aboutCol}>
          <div className={`${s.skeleton} ${s.sectionTitleSkeleton}`} />
          <hr className={s.lines} />
          <div className={s.aboutContent}>
            {Array.from({ length: 2 }).map((_, blockIndex) => (
              <div key={blockIndex} className={s.aboutBlockSkeleton}>
                <div className={`${s.skeleton} ${s.aboutHeadingSkeleton}`} />
                {Array.from({ length: 3 }).map((__, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`${s.skeleton} ${s.aboutLineSkeleton}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* TECH SPECS */}
        <aside className={s.specsCol}>
          <div className={`${s.skeleton} ${s.sectionTitleSkeleton}`} />
          <hr className={s.lines} />
          <dl className={s.specsList}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={s.specsRow}>
                <dt className={`${s.skeleton} ${s.specsLabelSkeleton}`} />
                <dd className={`${s.skeleton} ${s.specsValueSkeleton}`} />
              </div>
            ))}
          </dl>
        </aside>
      </section>

      {/* You may also like */}
      <section className={s.suggested}>
        <div className={s.suggestedHeaderSkeleton}>
          <div className={`${s.skeleton} ${s.sectionTitleSkeleton}`} />
        </div>
        <div className={s.suggestedSliderSkeleton}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={s.suggestedCardSkeleton}>
              <div className={`${s.skeleton} ${s.cardImageSkeleton}`} />
              <div className={`${s.skeleton} ${s.cardLineSkeleton}`} />
              <div className={`${s.skeleton} ${s.cardLineShortSkeleton}`} />
              <div className={`${s.skeleton} ${s.cardPriceSkeleton}`} />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};
