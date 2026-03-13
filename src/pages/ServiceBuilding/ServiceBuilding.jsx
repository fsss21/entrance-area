import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import BlockButtons from '../../components/BlockButtons/BlockButtons'
import sharedStyles from '../../styles/styles.module.css'
import styles from './ServiceBuilding.module.css'
import { loadData } from '../../api/loadData'

const ServiceBuilding = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const [floor, setFloor] = useState(1)
  const [data, setData] = useState(null)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? backgroundImg4k : backgroundImg)
  }, [])

  useEffect(() => {
    loadData('service-building.json').then(setData)
  }, [])

  useEffect(() => {
    const savedFloor = location.state?.floor
    if (savedFloor === 1 || savedFloor === 2) setFloor(savedFloor)
  }, [location.state?.floor])

  const handleBack = () => navigate('/menu-map')

  if (!data) {
    return (
      <div className={styles.serviceBuilding}>
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
        <div className={styles.content}>Загрузка...</div>
      </div>
    )
  }

  const floorData = floor === 1 ? data.floor1 : data.floor2
  const buttons = floorData.buttons.map((label, index) =>
    floor === 1 ? `${index + 1}. ${label}` : `${index + 5}. ${label}`
  )

  const handleHallClick = (index) => {
    const hall = floorData.halls?.[index]
    const pageTitle = hall?.name ?? floorData.buttons[index]
    navigate(`/service-building/item/${floor}/${index}`, { state: { pageTitle } })
  }

  return (
    <div className={styles.serviceBuilding}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <div className={styles.leftColumn}>
            <BlockButtons
              title={floorData.title}
              buttons={buttons}
              onBack={handleBack}
              onButtonClick={handleHallClick}
            />
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.planContainer}>
              <span className={styles.planPlaceholder}>{floorData.planText}</span>
              <div className={styles.floorSwitcher}>
                <button
                  type="button"
                  className={`${sharedStyles.universalButton} ${styles.switcherBtn} ${floor === 1 ? styles.floorButtonActive : ''}`}
                  onClick={() => setFloor(1)}
                >
                  1 этаж
                </button>
                <button
                  type="button"
                  className={`${sharedStyles.universalButton} ${styles.switcherBtn} ${floor === 2 ? styles.floorButtonActive : ''}`}
                  onClick={() => setFloor(2)}
                >
                  2 этаж
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceBuilding
