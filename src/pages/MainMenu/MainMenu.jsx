import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import catalogImgMenu from '../../assets/catalog_main_menu_img.png'
import structureMesuemBtn from '../../assets/main_menu_structure_museum_img.png'
import objectsBtn from '../../assets/main_menu_objects_img.png'
import actualInfoBtn from '../../assets/main_menu_actual_img.jpg'
import styles from './MainMenu.module.css'


const MainMenu = () => {
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const navigate = useNavigate()

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? backgroundImg4k : backgroundImg)
  }, [])

  const handleNavigateMenuMap = () => {
    navigate('/menu-map')
  }

  const handleNavigateObjectsBranches = () => {
    navigate('/objects-branches')
  }

  const handleNavigateActualInfo = () => {
    navigate('/actual-info')
  }


  return (
    <div className={styles.mainMenu}>
      <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={styles.content}>
        <div className={styles.buttons}>
          <button className={styles.buttonsItem}>
            <img onClick={handleNavigateMenuMap} src={structureMesuemBtn} alt='структура музея' />
          </button>
          <button className={styles.buttonsItem}>
            <img onClick={handleNavigateObjectsBranches} src={objectsBtn} alt='филиалы и объекты' />
          </button>
          <button className={styles.buttonsItem}>
            <img onClick={handleNavigateActualInfo} src={actualInfoBtn} alt='актуальная информация' />
          </button>
        </div>
        <img className={styles.catalogImgItem} src={catalogImgMenu} alt="" />
      </div>
    </div>
  )
}

export default MainMenu