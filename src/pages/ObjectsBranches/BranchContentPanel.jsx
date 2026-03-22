import ImageBlock from '../../components/ImageBlock/ImageBlock'
import sharedStyles from '../../styles/styles.module.css'
import styles from './BranchPage.module.css'

export default function BranchContentPanel({
  title,
  sections = [],
  textPage,
  setTextPage,
  images = [],
  imageIndex,
  setImageIndex,
  onBack,
  catalogButton = null,
  showActions = true,
}) {
  const totalTextPages = Math.max(1, sections.length)
  const currentSection = sections[textPage - 1] ?? sections[0]

  return (
    <>
      <div className={styles.leftColumn}>
        <aside className={styles.leftPanel}>
          <h1 className={styles.itemTitle}>{title}</h1>
          <div className={styles.sectionBody}>
            {currentSection && (
              <>
                <h2 className={styles.sectionTitle}>{currentSection.title}</h2>
                <p className={styles.sectionContent}>{currentSection.content}</p>
              </>
            )}
          </div>
          <div className={styles.panelFooter}>
            <div className={styles.textPagination}>
              <span className={styles.textPageCount}>
                {textPage} / {totalTextPages}
              </span>
              <div className={styles.textPaginationArrows}>
                <button
                  type="button"
                  className={styles.textPaginationArrow}
                  onClick={() => setTextPage((p) => Math.max(1, p - 1))}
                  disabled={textPage <= 1}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={styles.textPaginationArrow}
                  onClick={() => setTextPage((p) => Math.min(totalTextPages, p + 1))}
                  disabled={textPage >= totalTextPages}
                >
                  ›
                </button>
              </div>
            </div>
            {showActions && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${sharedStyles.universalButton} ${styles.actionButton}`}
                  onClick={onBack}
                >
                  Назад
                </button>
                {catalogButton}
              </div>
            )}
          </div>
        </aside>
      </div>
      <div className={styles.rightPanel}>
        <ImageBlock
          images={images}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
        />
      </div>
    </>
  )
}
