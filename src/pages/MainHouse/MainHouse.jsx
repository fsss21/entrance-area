import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import BlockButtons from '../../components/BlockButtons/BlockButtons'
import { loadData } from '../../api/loadData'
import styles from './MainHouse.module.css'

const MainHouse = () => {
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? backgroundImg4k : backgroundImg)
  }, [])

  useEffect(() => {
    loadData('main-house.json').then(setData)
  }, [])

  const handleBack = () => navigate('/menu-map')

  if (!data) {
    return (
      <div className={styles.mainHouse}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>Загрузка...</div>
      </div>
    )
  }

  const buttons = (data.buttons ?? []).map((label, index) => `${index + 9}. ${label}`)
  const planText = data.planText ?? 'план главного дома с номерами залов'
  const halls = data.halls ?? []

  const handleHallClick = (index) => {
    const hall = halls[index]
    const pageTitle = hall?.name ?? data.buttons[index]
    const pageTitleColor = hall?.color
    navigate(`/main-house/item/${index}`, { state: { pageTitle, pageTitleColor } })
  }

  return (
    <div className={styles.mainHouse}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <div className={styles.leftColumn}>
            <BlockButtons
              title="Главный дом"
              buttons={buttons}
              onBack={handleBack}
              onButtonClick={handleHallClick}
            />
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.planContainer}>
              <span className={styles.planPlaceholder}>{planText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainHouse
