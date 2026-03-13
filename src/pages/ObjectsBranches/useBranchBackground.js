import { useState, useEffect } from 'react'
import { getBranchBackgroundSrc } from './constants/branchBackgrounds'

export function useBranchBackground(branch) {
  const [imageSrc, setImageSrc] = useState(() =>
    getBranchBackgroundSrc(branch?.backgroundId, false)
  )

  useEffect(() => {
    const update = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      setImageSrc(getBranchBackgroundSrc(branch?.backgroundId, is4K))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [branch?.backgroundId])

  return imageSrc
}
