import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


import backgroundActualImg from '../../assets/back_actual_info_img.png'
import backgroundActualImg4k from '../../assets/back_actual_info_img-4k.png'
import styles from './ActualInfo.module.css'
import sharedStyles from '../../styles/styles.module.css'


const ActualInfo = () => {
    const navigate = useNavigate()
    const [imageSrc, setImageSrc] = useState(backgroundActualImg)

    useEffect(() => {
        const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
        setImageSrc(is4K ? backgroundActualImg4k : backgroundActualImg)
    }, [])

    const handleBack = () => navigate('/menu-map')
    const handleWork = () => navigate('/actual-info/work')
    const handleTime = () => navigate('/actual-info/time')
    const handleMeetings = () => navigate('/actual-info/meetings')

    return (
        <div className={styles.actualInfo}>
            <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
            <div className={styles.content}>
                <div onClick={handleWork} className={styles.containerWork} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleWork()} />

                <div onClick={handleTime} className={styles.containerTime} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleTime()} />

                <div onClick={handleMeetings} className={styles.containerMeetings} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleMeetings()} />
            </div>
            <div className={styles.backWrap}>
                <button type="button" className={sharedStyles.universalButton} onClick={handleBack}>
                    назад
                </button>
            </div>
            <footer className={styles.footer}>

            </footer>
        </div>
    )

}

export default ActualInfo