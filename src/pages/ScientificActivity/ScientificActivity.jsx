import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadData } from '../../api/loadData'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import BlockButtons from '../../components/BlockButtons/BlockButtons'
import styles from './ScientificActivity.module.css'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'


const ScientificActivity = () => {
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const [activeIndex, setActiveIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? backgroundImg4k : backgroundImg)
  }, [])

  useEffect(() => {
    loadData('scientific-activity.json').then(setData)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [activeIndex])

  const handleBack = () => navigate('/menu-map')

  if (!data) {
    return (
      <div className={styles.scientificActivity}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>Загрузка...</div>
      </div>
    )
  }

  const { buttons, categories, itemsPerPage } = data
  const items = categories?.[activeIndex]?.items ?? []
  const perPage = activeIndex === 0 ? (itemsPerPage ?? 8) : 6
  const totalPages = Math.max(1, Math.ceil((items?.length ?? 0) / perPage))
  const start = (page - 1) * perPage
  const itemsOnPage = (items ?? []).slice(start, start + perPage)

  return (
    <div className={styles.scientificActivity}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <div className={styles.leftColumn}>
            <BlockButtons
              title=""
              buttons={buttons ?? []}
              onBack={handleBack}
              activeIndex={activeIndex}
              activeColors={(buttons ?? []).map(() => '#000')}
              onButtonClick={setActiveIndex}
            />
          </div>
          <div className={activeIndex >= 1 ? styles.rightColumnProgram : styles.rightColumn}>

            {activeIndex === 0 ? (
              <div className={styles.itemsGrid}>
                {itemsOnPage.map((item) => (
                  <article key={item.id} className={styles.item}>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemDay}>{item.day},</span>
                      <span className={styles.itemDayWeek}>{item.dayOfWeek},</span>
                      <span className={styles.itemTime}>{item.time}</span>
                    </div>
                    <div className={styles.itemImageWrap}>
                      {item.image ? (
                        <img src={item.image} alt="" className={styles.itemImage} />
                      ) : (
                        <div className={styles.itemImagePlaceholder} aria-hidden />
                      )}
                    </div>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.programGrid}>
                {itemsOnPage.map((item) => (
                  <article key={item.id} className={styles.programItem}>
                    <div className={styles.programItemHeader}>
                      <span className={styles.programItemDate}>{item.date}</span>
                      <button type="button" className={styles.programWatchButton}>
                        смотреть
                      </button>
                    </div>
                    <div className={styles.programWrapperItem}>
                      {item.image ? (
                        <img src={item.image} alt="" className={styles.programItemImage} />
                      ) : (
                        <div className={styles.programItemImagePlaceholder} aria-hidden />
                      )}
                      <h3 className={styles.programItemTitle}>{item.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.paginationArrow}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ArrowBackIosIcon />
              </button>
              <span className={styles.pageCount}>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                className={styles.paginationArrow}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ArrowForwardIosIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScientificActivity
