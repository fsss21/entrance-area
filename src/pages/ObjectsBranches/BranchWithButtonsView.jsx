import BlockButtons from '../../components/BlockButtons/BlockButtons'
import sharedStyles from '../../styles/styles.module.css'
import BranchContentPanel from './BranchContentPanel'
import styles from './BranchPage.module.css'

export default function BranchWithButtonsView({
  branch,
  sectionIndex,
  onSectionClick,
  imageSrc,
  onBack,
  onCatalog,
  textPage,
  setTextPage,
  imageIndex,
  setImageIndex,
}) {
  const section = branch.sections?.[sectionIndex]
  const sections = section?.sections ?? []
  const images = section?.images ?? []
  const collectionId = section?.collectionId

  const catalogButton =
    collectionId != null && Number.isInteger(collectionId) && collectionId >= 0 ? (
      <button
        type="button"
        className={`${sharedStyles.universalButton} ${styles.actionButton}`}
        onClick={onCatalog}
      >
        Перейти в каталог
      </button>
    ) : null

  return (
    <div className={styles.page}>
      <div
        className={styles.background}
        style={{ backgroundImage: imageSrc ? `url(${imageSrc})` : undefined }}
      />
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <div className={styles.blockButtonsColumn}>
            <BlockButtons
              buttons={branch.buttons ?? []}
              onBack={onBack}
              activeIndex={sectionIndex}
              onButtonClick={onSectionClick}
            />
          </div>
          <div className={styles.contentArea}>
            <BranchContentPanel
              title={section?.name ?? branch.name}
              sections={sections}
              textPage={textPage}
              setTextPage={setTextPage}
              images={images}
              imageIndex={imageIndex}
              setImageIndex={setImageIndex}
              onBack={onBack}
              catalogButton={catalogButton}
              showActions={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
