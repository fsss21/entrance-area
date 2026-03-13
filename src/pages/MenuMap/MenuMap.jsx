import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import styles from './MenuMap.module.css'
import sharedStyles from '../../styles/styles.module.css'

const INTERACTIVE_OPTIONS = [
    'Интерактивный план',
    'коллекции',
    'научная деятельность',
    'образовательные программы',
]

const MenuMap = () => {
    const [imageSrc, setImageSrc] = useState(backgroundImg)
    const [activeInteractive, setActiveInteractive] = useState('Интерактивный план')
    const navigate = useNavigate()

    useEffect(() => {
        const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
        setImageSrc(is4K ? backgroundImg4k : backgroundImg)
    }, [])

    const handleBack = () => {
        navigate('/')
    }

    const handleNavigateService = () => {
        navigate('/service-building')
    }

    const handleNavigateMainHouse = () => {
        navigate('/main-house')
    }

    const handleClickCollection = () => navigate('/collection')
    const handleClickScientificActivity = () => navigate('/scientific-activity')
    const handleClickEducationalPrograms = () => navigate('/educational-programs')

    const handleInteractiveClick = (label) => {
        if (label === 'коллекции') handleClickCollection()
        else if (label === 'научная деятельность') handleClickScientificActivity()
        else if (label === 'образовательные программы') handleClickEducationalPrograms()
        else setActiveInteractive(label === activeInteractive ? null : label)
    }

    return (
        <div className={styles.menuMap}>
            <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
            <div className={styles.content}>
                <div className={styles.container}>
                    <button onClick={handleNavigateService} type="button" className={styles.sideButton}>
                        Служебный корпус
                    </button>
                    <div className={styles.topRow}>
                        <button type="button" className={styles.centerButton}>
                            Карта: 2 корпус+территория
                        </button>
                    </div>
                    <button onClick={handleNavigateMainHouse} type="button" className={styles.sideButton}>
                        Главный дом
                    </button>
                </div>
                <div className={styles.interactiveRow}>
                    <button onClick={handleBack} type="button" className={sharedStyles.universalButton}>
                        назад
                    </button>
                    {INTERACTIVE_OPTIONS.map((label) => (
                        <button
                            key={label}
                            type="button"
                            className={`${styles.interactiveBtn} ${activeInteractive === label ? styles.active : ''}`}
                            onClick={() => handleInteractiveClick(label)}
                        >
                            {label}
                        </button>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default MenuMap
