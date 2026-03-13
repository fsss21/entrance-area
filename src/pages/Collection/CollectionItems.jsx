import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import backgroundCollectionImg from '../../assets/background_collection_img.png'
import backgroundCollectionImg4k from '../../assets/background_collection_img-4k.png'
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

import sharedStyles from '../../styles/styles.module.css'
import styles from './CollectionItems.module.css'
import { loadData } from '../../api/loadData'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

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

const CollectionItems = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { collectionIndex: collectionIndexParam } = useParams()
  const [imageSrc, setImageSrc] = useState(backgroundCollectionImg)
  const [slideIndex, setSlideIndex] = useState(0)
  const [data, setData] = useState(null)

  const collectionIndex = parseInt(collectionIndexParam ?? '', 10)
  const collections = data?.collections ?? []
  const isValidIndex = Number.isInteger(collectionIndex) && collectionIndex >= 0 && collectionIndex < collections.length
  const activeCollection = isValidIndex ? collections[collectionIndex] : null
  const items = activeCollection?.items ?? []

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    if (activeCollection?.backgroundId && BACKGROUND_IMAGES[activeCollection.backgroundId]) {
      const [img, img4k] = BACKGROUND_IMAGES[activeCollection.backgroundId]
      setImageSrc(is4K ? img4k : img)
    } else {
      setImageSrc(is4K ? backgroundCollectionImg4k : backgroundCollectionImg)
    }
  }, [activeCollection?.backgroundId])

  useEffect(() => {
    const onResize = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      if (activeCollection?.backgroundId && BACKGROUND_IMAGES[activeCollection.backgroundId]) {
        const [img, img4k] = BACKGROUND_IMAGES[activeCollection.backgroundId]
        setImageSrc(is4K ? img4k : img)
      } else {
        setImageSrc(is4K ? backgroundCollectionImg4k : backgroundCollectionImg)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeCollection?.backgroundId])

  const fromCatalogButton = !!location.state?.returnTo
  const catalogPageTitle = activeCollection?.headerTitle
    ? activeCollection.headerTitle.replace(/^Коллекция:\s*/i, '').trim() + ': каталог экспонатов'
    : null

  useEffect(() => {
    if (!data || !activeCollection) return
    const title = fromCatalogButton ? catalogPageTitle : activeCollection.headerTitle
    const titleColor = location.state?.returnState?.pageTitleColor
    if (title && location.state?.pageTitle !== title) {
      navigate(`/collection/${collectionIndex}`, {
        state: {
          ...location.state,
          pageTitle: title,
          ...(titleColor != null && { pageTitleColor: titleColor }),
        },
        replace: true,
      })
    }
  }, [data, collectionIndex, activeCollection?.headerTitle, fromCatalogButton, catalogPageTitle, location.state, navigate])

  useEffect(() => {
    loadData('collection.json').then(setData)
  }, [])

  const handleBack = () => {
    if (location.state?.returnTo) {
      navigate(location.state.returnTo, { state: location.state.returnState ?? undefined })
    } else {
      navigate('/collection', { state: null })
    }
  }

  const handleItemClick = (itemIndex) => {
    navigate(`/collection/item/${collectionIndex}/${itemIndex}`, {
      state: {
        pageTitle: items[itemIndex]?.name,
        collectionIndex,
        collectionHeaderTitle: activeCollection?.headerTitle,
        returnTo: location.state?.returnTo,
        returnState: location.state?.returnState,
      },
    })
  }

  const goPrev = () =>
    setSlideIndex((i) => (i <= 0 ? items.length - 1 : i - 1))
  const goNext = () =>
    setSlideIndex((i) => (i >= items.length - 1 ? 0 : i + 1))

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>Загрузка...</div>
      </div>
    )
  }

  if (!isValidIndex || !activeCollection) {
    navigate('/collection', { replace: true })
    return null
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>
          <p>В этой коллекции пока нет экспонатов.</p>
          <button type="button" className={sharedStyles.universalButton} onClick={handleBack}>
            назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.carouselWrap}>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goPrev(); }}
            aria-label="Назад"
          >
            <ArrowBackIosIcon />
          </button>
          <div className={styles.carousel}>
            {[
              (slideIndex - 1 + items.length) % items.length,
              slideIndex,
              (slideIndex + 1) % items.length,
            ].map((idx, position) => {
              const item = items[idx]
              const isCenter = position === 1
              return (
                <div
                  key={`pos-${position}-idx-${idx}`}
                  role="button"
                  tabIndex={0}
                  className={`${styles.carouselSquare} ${position === 0 ? styles.carouselSquareSide : ''} ${position === 1 ? styles.carouselSquareCenter : ''} ${position === 2 ? styles.carouselSquareSide : ''}`}
                  onClick={() => isCenter && handleItemClick(idx)}
                  onKeyDown={(e) => e.key === 'Enter' && isCenter && handleItemClick(idx)}
                  aria-label={isCenter ? `Открыть ${item?.name}` : undefined}
                >
                  <div
                    className={styles.carouselItemImage}
                    style={item?.placeholderImg ? { backgroundImage: `url(${item.placeholderImg})` } : undefined}
                  />
                  <span className={styles.carouselItemTitle}>{item?.name ?? 'название предмета'}</span>
                </div>
              )
            })}
          </div>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goNext(); }}
            aria-label="Вперёд"
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
        <div className={styles.backBtn}>
          <button type="button" className={sharedStyles.universalButton} onClick={handleBack}>
            назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectionItems
