import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import BlockButtons from '../../components/BlockButtons/BlockButtons'
import { loadData } from '../../api/loadData'
import styles from './EducationalPrograms.module.css'

const EducationalPrograms = () => {
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
    loadData('educational-programs.json').then(setData)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [activeIndex])

  const handleBack = () => navigate('/menu-map')

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>Загрузка...</div>
      </div>
    )
  }

  const { buttons, categories, itemsPerPage } = data
  const items = categories?.[activeIndex]?.items ?? []
  const totalPages = Math.max(1, Math.ceil((items?.length ?? 0) / (itemsPerPage ?? 3)))
  const start = (page - 1) * (itemsPerPage ?? 3)
  const itemsOnPage = (items ?? []).slice(start, start + (itemsPerPage ?? 3))

  return (
    <div className={styles.educationalPrograms}>
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
          <div className={styles.rightColumn}>
            <div className={styles.itemsGrid}>
              {itemsOnPage.map((item) => (
                <article key={item.id} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemDate}>{item.date}</span>
                    <button type="button" className={styles.watchButton}>
                      смотреть
                    </button>
                  </div>
                  <div className={styles.wrapperItem}>
                    <div className={styles.itemImage} />
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.paginationArrow}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ‹
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
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationalPrograms
