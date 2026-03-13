import { useRef, useCallback } from 'react'
import styles from './ImageBlock.module.css'

export default function ImageBlock({ images = [], imageIndex, setImageIndex }) {
  const wrapperRef = useRef(null)
  const totalImages = Math.max(1, images.length)
  const currentImage = images[imageIndex]

  const goPrev = useCallback(() => {
    setImageIndex((i) => Math.max(0, i - 1))
  }, [setImageIndex])

  const goNext = useCallback(() => {
    setImageIndex((i) => Math.min(totalImages - 1, i + 1))
  }, [setImageIndex, totalImages])

  const toggleFullscreen = useCallback(() => {
    const el = wrapperRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [])

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.imageContainer}>
        {currentImage ? (
          <img src={currentImage} alt="" />
        ) : (
          <span>Изображение</span>
        )}
      </div>
      <div className={styles.imagePagination}>
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
        <button
          type="button"
          className={styles.fullscreenButton}
          title="На весь экран"
          aria-label="На весь экран"
          onClick={toggleFullscreen}
        >
          ⛶
        </button>
      </div>

    </div>
  )
}
