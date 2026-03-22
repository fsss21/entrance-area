import { useCallback, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './ImageBlock.module.css'

export default function ImageBlock({ images = [], imageIndex, setImageIndex }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const totalImages = Math.max(1, images.length)
  const hasMultipleImages = images.length > 1
  const currentImage = images[imageIndex]

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxOpen])

  const goPrev = useCallback(() => {
    setImageIndex((i) => Math.max(0, i - 1))
  }, [setImageIndex])

  const goNext = useCallback(() => {
    setImageIndex((i) => Math.min(totalImages - 1, i + 1))
  }, [setImageIndex, totalImages])

  const openLightbox = useCallback(() => setLightboxOpen(true), [])
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.imageContainer}>
          {currentImage ? (
            <img src={currentImage} alt="" />
          ) : (
            <span>Изображение</span>
          )}
        </div>
        <div className={styles.imagePagination}>
          {hasMultipleImages ? (
            <div className={styles.imagePaginationButtons}>
              <button
                type="button"
                className={styles.imagePaginationArrow}
                onClick={goPrev}
                disabled={imageIndex <= 0}
              >
                ‹
              </button>
              <span className={styles.imagePageCount}>
                {imageIndex + 1} / {totalImages}
              </span>
              <button
                type="button"
                className={styles.imagePaginationArrow}
                onClick={goNext}
                disabled={imageIndex >= totalImages - 1}
              >
                ›
              </button>
            </div>
          ) : (
            <div className={styles.imagePaginationSpacer} aria-hidden />
          )}
          <button
            type="button"
            className={styles.fullscreenButton}
            title="Показать крупнее"
            aria-label="Показать крупнее поверх страницы"
            onClick={openLightbox}
          >
            ⛶
          </button>
        </div>
      </div>

      {lightboxOpen &&
        createPortal(
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр изображения"
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={closeLightbox}
              title="Закрыть"
              aria-label="Закрыть полноэкранный просмотр"
            >
              ×
            </button>
            <div className={styles.lightboxBody}>
              <div className={styles.lightboxImageWrap}>
                {currentImage ? (
                  <img src={currentImage} alt="" className={styles.lightboxImg} />
                ) : null}
              </div>
              {hasMultipleImages && (
                <div className={styles.lightboxPagination}>
                  <button
                    type="button"
                    className={styles.lightboxArrow}
                    onClick={goPrev}
                    disabled={imageIndex <= 0}
                    aria-label="Предыдущее изображение"
                  >
                    ‹
                  </button>
                  <span className={styles.lightboxCount}>
                    {imageIndex + 1} / {totalImages}
                  </span>
                  <button
                    type="button"
                    className={styles.lightboxArrow}
                    onClick={goNext}
                    disabled={imageIndex >= totalImages - 1}
                    aria-label="Следующее изображение"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
