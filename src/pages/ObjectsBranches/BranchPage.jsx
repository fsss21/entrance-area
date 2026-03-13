import { useState, useEffect } from 'react'
import { useBranchData } from './useBranchData'
import { useBranchBackground } from './useBranchBackground'
import BranchMapView from './BranchMapView'
import BranchSimpleView from './BranchSimpleView'
import BranchWithButtonsView from './BranchWithButtonsView'
import { getBranchBackgroundSrc } from './constants/branchBackgrounds'
import styles from './BranchPage.module.css'

export default function BranchPage() {
  const { data, branch, branchId, navigate, location } = useBranchData()
  const imageSrc = useBranchBackground(branch)

  const [sectionIndex, setSectionIndex] = useState(0)
  const [textPage, setTextPage] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    if (branch?.type !== 'with-buttons') return
    const saved = location.state?.sectionIndex
    const maxIndex = (branch.sections?.length ?? 1) - 1
    if (typeof saved === 'number' && saved >= 0 && saved <= maxIndex) {
      setSectionIndex(saved)
    } else {
      setSectionIndex(0)
    }
  }, [branch?.id, branch?.type, branch?.sections?.length, location.state?.sectionIndex])

  const handleBack = () => navigate('/objects-branches')

  const handleSectionClick = (index) => {
    setSectionIndex(index)
    setTextPage(1)
    setImageIndex(0)
  }

  const handleCatalog = () => {
    const section = branch?.sections?.[sectionIndex]
    const collectionId = section?.collectionId
    if (collectionId != null && Number.isInteger(collectionId) && collectionId >= 0) {
      navigate(`/collection/${collectionId}`, {
        state: {
          returnTo: `/objects-branches/branch/${branchId}`,
          returnState: { pageTitle: branch.name, sectionIndex },
        },
      })
    }
  }

  if (!data) {
    const loadingBg = getBranchBackgroundSrc(undefined, false)
    return (
      <div className={styles.page}>
        <div
          className={styles.background}
          style={{ backgroundImage: loadingBg ? `url(${loadingBg})` : undefined }}
        />
        <div className={styles.content}>Загрузка...</div>
      </div>
    )
  }

  if (!branch) {
    navigate('/objects-branches')
    return null
  }

  if (branch.type === 'map') {
    return <BranchMapView branch={branch} imageSrc={imageSrc} onBack={handleBack} />
  }

  if (branch.type === 'simple') {
    return (
      <BranchSimpleView
        branch={branch}
        imageSrc={imageSrc}
        onBack={handleBack}
        textPage={textPage}
        setTextPage={setTextPage}
        imageIndex={imageIndex}
        setImageIndex={setImageIndex}
      />
    )
  }

  return (
    <BranchWithButtonsView
      branch={branch}
      sectionIndex={sectionIndex}
      onSectionClick={handleSectionClick}
      imageSrc={imageSrc}
      onBack={handleBack}
      onCatalog={handleCatalog}
      textPage={textPage}
      setTextPage={setTextPage}
      imageIndex={imageIndex}
      setImageIndex={setImageIndex}
    />
  )
}
