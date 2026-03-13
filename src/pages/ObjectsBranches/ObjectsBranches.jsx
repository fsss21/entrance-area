import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import styles from './ObjectsBranches.module.css'
import sharedStyles from '../../styles/styles.module.css'

const BRANCHES = [
    { label: 'Александро-Невская Лавра', id: 'lavra' },
    { label: 'Уткина Дача', id: 'utkina' },
    { label: 'Памятники города', id: 'monuments' },
    { label: 'Реставрационные мастерские', id: 'restoration' },
    { label: 'Литераторские мостки', id: 'literatorskie' },
    { label: 'Волковское кладбище', id: 'volkovo' },
    { label: 'Невский, 19', id: 'nevsky19' },
    { label: 'Мастерская Аникушина', id: 'anikushin' },
]

const ObjectsBranches = () => {
    const navigate = useNavigate()
    const [imageSrc, setImageSrc] = useState(backgroundImg)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
        setImageSrc(is4K ? backgroundImg4k : backgroundImg)
    }, [])

    const handleBack = () => navigate('/menu-map')

    const handleBranchClick = (index, branch) => {
        setSelectedIndex(index)
        navigate(`/objects-branches/branch/${branch.id}`, { state: { pageTitle: branch.label } })
    }

    return (
        <div className={styles.objectsBranches}>
            <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
            <div className={styles.content}>
                <h2 className={styles.title}>ФИЛИАЛЫ <br /> И ОБЪЕКТЫ</h2>
                <div className={styles.grid}>
                    <div className={styles.row}>
                        {BRANCHES.slice(0, 3).map((branch, index) => (
                            <button
                                key={branch.id}
                                type="button"
                                className={`${styles.gridBtn} ${styles[`gridBtn${index + 1}`]} ${selectedIndex === index ? styles.gridBtnActive : ''}`}
                                onClick={() => handleBranchClick(index, branch)}
                            >
                                {branch.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.row}>
                        {BRANCHES.slice(3, 6).map((branch, index) => (
                            <button
                                key={branch.id}
                                type="button"
                                className={`${styles.gridBtn} ${styles[`gridBtn${index + 4}`]} ${selectedIndex === index + 3 ? styles.gridBtnActive : ''}`}
                                onClick={() => handleBranchClick(index + 3, branch)}
                            >
                                {branch.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.row}>
                        {BRANCHES.slice(6, 8).map((branch, index) => (
                            <button
                                key={branch.id}
                                type="button"
                                className={`${styles.gridBtn} ${styles[`gridBtn${index + 7}`]} ${selectedIndex === index + 6 ? styles.gridBtnActive : ''}`}
                                onClick={() => handleBranchClick(index + 6, branch)}
                            >
                                {branch.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.backWrap}>
                    <button type="button" className={sharedStyles.universalButton} onClick={handleBack}>
                        назад
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ObjectsBranches
