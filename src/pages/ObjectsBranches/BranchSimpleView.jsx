import BranchContentPanel from './BranchContentPanel'
import styles from './BranchPage.module.css'

export default function BranchSimpleView({
  branch,
  imageSrc,
  onBack,
  textPage,
  setTextPage,
  imageIndex,
  setImageIndex,
}) {
  const sections = branch.sections ?? []
  const images = branch.images ?? []

  return (
    <div className={styles.page}>
      <div
        className={styles.background}
        style={{ backgroundImage: imageSrc ? `url(${imageSrc})` : undefined }}
      />
      <div className={styles.content}>
        <div className={styles.simpleWrapper}>
          <BranchContentPanel
            title={branch.name}
            sections={sections}
            textPage={textPage}
            setTextPage={setTextPage}
            images={images}
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
            onBack={onBack}
          />
        </div>
      </div>
    </div>
  )
}
