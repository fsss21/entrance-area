import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import backgroundCollectionImg from '../../assets/background_collection_img.png'
import backgroundCollectionImg4k from '../../assets/background_collection_img-4k.png'
import sharedStyles from '../../styles/styles.module.css'
import styles from './Collection.module.css'
import { loadData } from '../../api/loadData'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const Collection = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [imageSrc, setImageSrc] = useState(backgroundCollectionImg)
  const [slideIndex, setSlideIndex] = useState(0)
  const [data, setData] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const collections = data?.collections ?? []

  useEffect(() => {
    if (!collections.length) return
    const saved = location.state?.carouselSlideIndex
    if (typeof saved !== 'number' || Number.isNaN(saved)) return
    const clamped = Math.max(0, Math.min(Math.floor(saved), collections.length - 1))
    setSlideIndex(clamped)
  }, [collections.length, location.state?.carouselSlideIndex])

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? backgroundCollectionImg4k : backgroundCollectionImg)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      setImageSrc(is4K ? backgroundCollectionImg4k : backgroundCollectionImg)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    loadData('collection.json').then(setData)
  }, [])

  const handleBack = () => navigate('/menu-map')

  const handleCollectionClick = (index) => {
    const collection = collections[index]
    navigate(`/collection/${index}`, {
      state: { pageTitle: collection?.headerTitle ?? collection?.name },
    })
  }

  const runTransition = (fn) => {
    setIsTransitioning(true)
    fn()
    setTimeout(() => setIsTransitioning(false), 320)
  }

  const goPrev = () =>
    runTransition(() =>
      setSlideIndex((i) => (i <= 0 ? collections.length - 1 : i - 1))
    )
  const goNext = () =>
    runTransition(() =>
      setSlideIndex((i) => (i >= collections.length - 1 ? 0 : i + 1))
    )

  if (!data) {
    return (
      <div className={styles.collection}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>Загрузка...</div>
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <div className={styles.collection}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>
          <button type="button" className={sharedStyles.universalButton} onClick={handleBack}>
            назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.collection}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.carouselWrap}>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={goPrev}
            aria-label="Назад"
          >
            <ArrowBackIosIcon />
          </button>
          <div className={styles.carousel}>
            {[
              (slideIndex - 1 + collections.length) % collections.length,
              slideIndex,
              (slideIndex + 1) % collections.length,
            ].map((idx, position) => {
              const collection = collections[idx]
              const isCenter = position === 1
              return (
                <div
                  key={`pos-${position}`}
                  role="button"
                  tabIndex={0}
                  className={`${styles.carouselSquare} ${position === 0 ? styles.carouselSquareSide : ''} ${position === 1 ? styles.carouselSquareCenter : ''} ${position === 2 ? styles.carouselSquareSide : ''} ${isTransitioning ? styles.carouselSquareTransitioning : ''}`}
                  onClick={() => isCenter && handleCollectionClick(idx)}
                  onKeyDown={(e) => e.key === 'Enter' && isCenter && handleCollectionClick(idx)}
                  aria-label={isCenter ? `Открыть коллекцию ${collection?.name}` : undefined}
                >
                  <span className={styles.squareTitle}>{collection?.name}</span>
                </div>
              )
            })}
          </div>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={goNext}
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

export default Collection
