import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import hallImg from '../../assets/hall_back_img.png'
import hallImg4k from '../../assets/hall_back_img-4k.png'
import peterImg from '../../assets/peter_back_img.png'
import peterImg4k from '../../assets/peter_back_img-4k.png'
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
import { loadData } from '../../api/loadData'
import ImageBlock from '../../components/ImageBlock/ImageBlock'
import sharedStyles from '../../styles/styles.module.css'
import styles from './ServiceBuildingItem.module.css'

const BACKGROUND_IMAGES = {
  hall: [hallImg, hallImg4k],
  peter: [peterImg, peterImg4k],
  propaganda: [propagandaImg, propagandaImg4k],
  gerackl: [geracklImg, geracklImg4k],
  new_era: [newEraImg, newEraImg4k],
  competitive: [competitiveImg, competitiveImg4k],
  soviet_era: [sovietEraImg, sovietEraImg4k],
  coridor: [coridorImg, coridorImg4k],
}

const ServiceBuildingItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { floor, hallIndex } = useParams()
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const [data, setData] = useState(null)
  const [textPage, setTextPage] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)

  const floorNum = parseInt(floor, 10)
  const hallIdx = parseInt(hallIndex, 10)

  useEffect(() => {
    loadData('service-building.json').then(setData)
  }, [])

  useEffect(() => {
    const updateBg = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      const floorKey = floorNum === 1 ? 'floor1' : 'floor2'
      const hall = data?.[floorKey]?.halls?.[hallIdx]
      const pair = hall?.backgroundId && BACKGROUND_IMAGES[hall.backgroundId]
      const [img, img4k] = pair || [backgroundImg, backgroundImg4k]
      setImageSrc(is4K ? img4k : img)
    }
    updateBg()
    window.addEventListener('resize', updateBg)
    return () => window.removeEventListener('resize', updateBg)
  }, [data, floorNum, hallIdx])

  useEffect(() => {
    if (data && floorNum >= 1 && floorNum <= 2 && hallIdx >= 0 && hallIdx <= 3) {
      const floorKey = floorNum === 1 ? 'floor1' : 'floor2'
      const hall = data[floorKey]?.halls?.[hallIdx]
      if (hall && location.state?.pageTitle !== hall.name) {
        navigate(location.pathname, { state: { pageTitle: hall.name }, replace: true })
      }
      if (hall) document.title = hall.name
    }
  }, [data, floorNum, hallIdx, location.pathname, location.state?.pageTitle, navigate])

  useEffect(() => {
    if (!data) return
    const floorKey = floorNum === 1 ? 'floor1' : 'floor2'
    const floorData = data[floorKey]
    const h = floorData?.halls?.[hallIdx]
    if (!floorData || !h) {
      navigate('/service-building', { replace: true })
    }
  }, [data, floorNum, hallIdx, navigate])

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

  const floorKey = floorNum === 1 ? 'floor1' : 'floor2'
  const floorData = data[floorKey]
  const hall = floorData?.halls?.[hallIdx]

  if (!floorData || !hall) {
    return null
  }

  const sections = hall.sections ?? []
  const totalTextPages = Math.max(1, sections.length)
  const currentSection = sections[textPage - 1] ?? sections[0]
  const images = hall.images ?? []

  const handleBack = () => navigate('/service-building', { state: { floor: floorNum } })
  const handleCatalog = () => {
    const id = hall.collectionId
    if (id != null && Number.isInteger(id) && id >= 0) {
      navigate(`/collection/${id}`, {
        state: {
          returnTo: `/service-building/item/${floorNum}/${hallIdx}`,
          returnState: { pageTitle: hall.name, floor: floorNum, pageTitleColor: hall?.color },
        },
      })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <aside className={styles.leftPanel}>
            <h1 className={styles.itemTitle}>{hall.name}</h1>
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
            <button
              type="button"
              className={`${sharedStyles.universalButton} ${styles.actionButton}`}
              onClick={handleCatalog}
            >
              Каталог экспонатов зала
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

export default ServiceBuildingItem
