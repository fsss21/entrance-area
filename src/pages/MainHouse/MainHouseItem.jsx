import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import timeHallImg from '../../assets/time_hall_back_img.png'
import timeHallImg4k from '../../assets/time_hall_back_img-4k.png'
import maketsImg from '../../assets/makets_back_img.png'
import maketsImg4k from '../../assets/makets_back_img-4k.png'
import masterClassImg from '../../assets/master_class_back_img.png'
import masterClassImg4k from '../../assets/master_class_back_img-4k.png'
import conferenceImg from '../../assets/conference_back_img.png'
import conferenceImg4k from '../../assets/conference_back_img-4k.png'
import hallImg from '../../assets/hall_back_img.png'
import hallImg4k from '../../assets/hall_back_img-4k.png'
import officeArchiImg from '../../assets/office_archi_back_img.png'
import officeArchiImg4k from '../../assets/office_archi_back_img-4k.png'
import officeSculptorImg from '../../assets/office_sculptor_back_img.png'
import officeSculptorImg4k from '../../assets/office_sculptor_back_img-4k.png'
import { loadData } from '../../api/loadData'
import ImageBlock from '../../components/ImageBlock/ImageBlock'
import sharedStyles from '../../styles/styles.module.css'
import styles from './MainHouseItem.module.css'

const BACKGROUND_IMAGES = {
  time_hall: [timeHallImg, timeHallImg4k],
  makets: [maketsImg, maketsImg4k],
  master_class: [masterClassImg, masterClassImg4k],
  conference: [conferenceImg, conferenceImg4k],
  hall: [hallImg, hallImg4k],
  office_archi: [officeArchiImg, officeArchiImg4k],
  office_sculptor: [officeSculptorImg, officeSculptorImg4k],
}

const MainHouseItem = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hallIndex } = useParams()
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const [data, setData] = useState(null)
  const [textPage, setTextPage] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)

  const hallIdx = parseInt(hallIndex, 10)

  useEffect(() => {
    loadData('main-house.json').then(setData)
  }, [])

  useEffect(() => {
    const updateBg = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      const halls = data?.halls ?? []
      const hall = halls[hallIdx]
      const pair = hall?.backgroundId && BACKGROUND_IMAGES[hall.backgroundId]
      const [img, img4k] = pair || [backgroundImg, backgroundImg4k]
      setImageSrc(is4K ? img4k : img)
    }
    updateBg()
    window.addEventListener('resize', updateBg)
    return () => window.removeEventListener('resize', updateBg)
  }, [data, hallIdx])

  useEffect(() => {
    if (data && hallIdx >= 0 && hallIdx < (data.halls?.length ?? 0)) {
      const hall = data.halls[hallIdx]
      if (hall && location.state?.pageTitle !== hall.name) {
        navigate(location.pathname, {
          state: { pageTitle: hall.name, pageTitleColor: hall.color },
          replace: true,
        })
      }
      if (hall) document.title = hall.name
    }
  }, [data, hallIdx, location.pathname, location.state?.pageTitle, navigate])

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <div className={styles.leftPanel}>Загрузка...</div>
          </div>
          <div className={styles.rightPanel} />
        </div>
      </div>
    )
  }

  const halls = data.halls ?? []
  const hall = halls[hallIdx]

  if (!hall) {
    navigate('/main-house')
    return null
  }

  const sections = hall.sections ?? []
  const totalTextPages = Math.max(1, sections.length)
  const currentSection = sections[textPage - 1] ?? sections[0]
  const images = hall.images ?? []

  const handleBack = () => navigate('/main-house')
  const handleCatalog = () => {
    const id = hall.collectionId
    if (id != null && Number.isInteger(id) && id >= 0) {
      navigate(`/collection/${id}`, {
        state: {
          returnTo: `/main-house/item/${hallIdx}`,
          returnState: { pageTitle: hall.name, pageTitleColor: hall.color },
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

export default MainHouseItem
