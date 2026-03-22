import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import backgroundImg from '../../assets/background_collection_img.png'
import backgroundImg4k from '../../assets/background_collection_img-4k.png'
import peterImg from '../../assets/peter_back_img.png'
import peterImg4k from '../../assets/peter_back_img-4k.png'
import hallImg from '../../assets/hall_back_img.png'
import hallImg4k from '../../assets/hall_back_img-4k.png'
import propagandaImg from '../../assets/propaganda_back_img.png'
import propagandaImg4k from '../../assets/propaganda_back_img-4k.png'
import geracklImg from '../../assets/gerackl_back_img.png'
import geracklImg4k from '../../assets/gerackl_back_img-4k.png'
import newEraImg from '../../assets/new_era_back_img.png'
import newEraImg4k from '../../assets/new_era_back_img-4k.png'
import competitiveImg from '../../assets/competitive_back_img.png'
import competitiveImg4k from '../../assets/competitive_back_img-4k.png'
import sovietEraImg from '../../assets/soviet_era_back_img.png'
import sovietEraImg4k from '../../assets/soviet_era_back_img-4k.png'
import coridorImg from '../../assets/coridor_back_img.png'
import coridorImg4k from '../../assets/coridor_back_img-4k.png'
import timeHallImg from '../../assets/time_hall_back_img.png'
import timeHallImg4k from '../../assets/time_hall_back_img-4k.png'
import maketsImg from '../../assets/makets_back_img.png'
import maketsImg4k from '../../assets/makets_back_img-4k.png'
import masterClassImg from '../../assets/master_class_back_img.png'
import masterClassImg4k from '../../assets/master_class_back_img-4k.png'
import conferenceImg from '../../assets/conference_back_img.png'
import conferenceImg4k from '../../assets/conference_back_img-4k.png'
import officeArchiImg from '../../assets/office_archi_back_img.png'
import officeArchiImg4k from '../../assets/office_archi_back_img-4k.png'
import officeSculptorImg from '../../assets/office_sculptor_back_img.png'
import officeSculptorImg4k from '../../assets/office_sculptor_back_img-4k.png'

import { loadData } from '../../api/loadData'
import ImageBlock from '../../components/ImageBlock/ImageBlock'
import sharedStyles from '../../styles/styles.module.css'
import styles from './CollectionItem.module.css'

const BACKGROUND_IMAGES = {
  peter: [peterImg, peterImg4k],
  hall: [hallImg, hallImg4k],
  propaganda: [propagandaImg, propagandaImg4k],
  gerackl: [geracklImg, geracklImg4k],
  new_era: [newEraImg, newEraImg4k],
  competition: [competitiveImg, competitiveImg4k],
  soviet_monuments: [sovietEraImg, sovietEraImg4k],
  coridor: [coridorImg, coridorImg4k],
  time_hall: [timeHallImg, timeHallImg4k],
  makets: [maketsImg, maketsImg4k],
  master_class: [masterClassImg, masterClassImg4k],
  conference: [conferenceImg, conferenceImg4k],
  architect: [officeArchiImg, officeArchiImg4k],
  sculptor: [officeSculptorImg, officeSculptorImg4k],
  findings: [hallImg, hallImg4k],
}

const CollectionItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { collectionIndex: collectionIndexParam, itemIndex: itemIndexParam } = useParams()
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const [data, setData] = useState(null)
  const [textPage, setTextPage] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)

  const collectionIdx = parseInt(collectionIndexParam ?? '', 10)
  const itemIdx = parseInt(itemIndexParam ?? '', 10)

  useEffect(() => {
    loadData('collection.json').then(setData)
  }, [])

  useEffect(() => {
    const updateBg = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      const collection = data?.collections?.[collectionIdx]
      const pair = collection?.backgroundId && BACKGROUND_IMAGES[collection.backgroundId]
      const [img, img4k] = pair || [backgroundImg, backgroundImg4k]
      setImageSrc(is4K ? img4k : img)
    }
    updateBg()
    window.addEventListener('resize', updateBg)
    return () => window.removeEventListener('resize', updateBg)
  }, [data, collectionIdx])

  const collection = data?.collections?.[collectionIdx]
  const item = collection?.items?.[itemIdx]
  const collectionValid = data && Number.isInteger(collectionIdx) && collectionIdx >= 0 && collectionIdx < (data?.collections?.length ?? 0)
  const itemValid = collection && Number.isInteger(itemIdx) && itemIdx >= 0 && itemIdx < (collection?.items?.length ?? 0)

  useEffect(() => {
    if (data && (!collectionValid || !itemValid)) {
      navigate('/collection', { replace: true })
    }
  }, [data, collectionValid, itemValid, navigate])

  useEffect(() => {
    if (data && item && location.state?.pageTitle !== item.name) {
      navigate(location.pathname, { state: { ...location.state, pageTitle: item.name }, replace: true })
    }
    if (item) document.title = item.name
  }, [data, item, location.pathname, location.state, navigate])

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>
          <div className={styles.leftPanel}>Загрузка...</div>
          <div className={styles.rightPanel} />
        </div>
      </div>
    )
  }

  if (!collectionValid || !itemValid || !collection || !item) {
    return null
  }

  const sections = item.sections ?? []
  const totalTextPages = Math.max(1, sections.length)
  const currentSection = sections[textPage - 1] ?? sections[0]
  const images = item.images ?? []

  const handleBack = () => {
    const catalogTitle = collection?.headerTitle
      ? collection.headerTitle.replace(/^Коллекция:\s*/i, '').trim() + ': каталог экспонатов'
      : collection?.headerTitle
    navigate(`/collection/${collectionIdx}`, {
      state: {
        pageTitle: location.state?.returnTo ? catalogTitle : collection.headerTitle,
        returnTo: location.state?.returnTo,
        returnState: location.state?.returnState,
        collectionItemSlideIndex: itemIdx,
      },
    })
  }

  const handleCatalog = () => {
    // Можно позже привязать к каталогу экспонатов коллекции
  }

  return (
    <div className={styles.page}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <aside className={styles.leftPanel}>
            <h1 className={styles.itemTitle}>{item.name}</h1>
            <div>
              {currentSection && (
                <>
                  <h2 className={styles.sectionTitle}>{currentSection.title}</h2>
                  <p className={styles.sectionContent}>{currentSection.content}</p>
                </>
              )}
            </div>
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
          </aside>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${sharedStyles.universalButton} ${styles.actionButton}`}
              onClick={handleBack}
            >
              Назад
            </button>

          </div>
        </div>
        <div className={styles.rightPanel}>
          <ImageBlock
            images={images}
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
          />
        </div>
      </div>
    </div>
  )
}

export default CollectionItem
