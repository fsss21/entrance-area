import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import backgroundImg from '../../assets/background_img.png'
import backgroundImg4k from '../../assets/background_img-4k.png'
import utkinaImg from '../../assets/utkina_back_img.png'
import utkinaImg4k from '../../assets/utkina_back_img-4k.png'
import masterImg from '../../assets/master_back_img.png'
import masterImg4k from '../../assets/master_back_img-4k.png'
import newImg from '../../assets/new_back_img.png'
import newImg4k from '../../assets/new_back_img-4k.png'
import museumImg from '../../assets/museum_back_img.png'
import museumImg4k from '../../assets/museum_back_img-4k.png'
import necropolImg from '../../assets/necropol_back_img.png'
import necropolImg4k from '../../assets/necropol_back_img-4k.png'
import gateImg from '../../assets/gate_back_img.png'
import gateImg4k from '../../assets/gate_back_img-4k.png'
import nevskiImg from '../../assets/nevski_back_img.png'
import nevskiImg4k from '../../assets/nevski_back_img-4k.png'
import BlockButtons from '../../components/BlockButtons/BlockButtons'
import { loadData } from '../../api/loadData'
import styles from './ActualInfoSection.module.css'
import Sharedstyles from '../../styles/styles.module.css'

const BACKGROUND_IMAGES = {
  utkina: [utkinaImg, utkinaImg4k],
  master: [masterImg, masterImg4k],
  new: [newImg, newImg4k],
  museum: [museumImg, museumImg4k],
  necropol: [necropolImg, necropolImg4k],
  gate: [gateImg, gateImg4k],
  nevski: [nevskiImg, nevskiImg4k],
}

const EXHIBITIONS_PER_PAGE = 6

function renderWorkInfo(workInfo) {
  if (!workInfo) return null
  const { schedule = [], address, phone, email } = workInfo
  const hasAny = schedule.length > 0 || address || phone || email
  if (!hasAny) return null
  return (
    <>
      {schedule.length > 0 && (
        <>
          <h3>Режим работы:</h3>
          <ul>
            {schedule.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </>
      )}
      {address && (
        <p><strong>Адрес:</strong> {address}</p>
      )}
      {phone && (
        <p><strong>Телефон:</strong> {phone}</p>
      )}
      {email && (
        <p><strong>e-mail:</strong> {email}</p>
      )}
    </>
  )
}

function renderPracticalInfo(practicalInfo) {
  if (!practicalInfo?.sections?.length) return null
  return (
    <>
      {practicalInfo.sections.map((section, i) => (
        <div key={i}>
          <h3>{section.title}</h3>
          <ul>
            {section.items.map((item, j) => (
              <li key={j}>
                {item.includes('Бесплатное посещение') ? (
                  <>
                    <strong>Бесплатное посещение</strong> {item.replace('Бесплатное посещение ', '')}
                  </>
                ) : (
                  item
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

function renderScheduleContent(scheduleContent) {
  if (!scheduleContent) return null
  const { schedule = [], holidaysTitle, holidays = [], paragraphs = [] } = scheduleContent
  return (
    <>
      <h3>РАСПИСАНИЕ</h3>
      <ul className={styles.scheduleList}>
        {schedule.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      {holidays.length > 0 && (
        <>
          <h4>{holidaysTitle}</h4>
          <ul>
            {holidays.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </>
      )}
      {paragraphs.map((text, i) => {
        const parts = []
        if (text.startsWith('Часы работы:')) {
          parts.push(<strong key="h">Часы работы: </strong>, text.slice(12))
        } else if (text.startsWith('Билеты:')) {
          parts.push(<strong key="b">Билеты: </strong>, text.slice(8))
        } else if (text.startsWith('Адрес:')) {
          parts.push(<strong key="a">Адрес: </strong>, text.slice(7))
        } else if (text.startsWith('Телефон:')) {
          parts.push(<strong key="t">Телефон: </strong>, text.slice(9))
        } else {
          parts.push(text)
        }
        return <p key={i}>{parts}</p>
      })}
    </>
  )
}

function getBackgroundForBranch(branches, activeIndex, section, is4K) {
  if (section === 'time' || section === 'meetings') {
    return null
  }
  const branch = branches[activeIndex]
  const pair = branch?.backgroundId && BACKGROUND_IMAGES[branch.backgroundId]
  const [img, img4k] = pair || [backgroundImg, backgroundImg4k]
  return is4K ? img4k : img
}

const ActualInfoSection = () => {
  const navigate = useNavigate()
  const { section } = useParams()
  const [imageSrc, setImageSrc] = useState(backgroundImg)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeBranchIndex, setActiveBranchIndex] = useState(0)
  const [timePage, setTimePage] = useState(1)
  const [data, setData] = useState(null)

  useEffect(() => {
    const updateBg = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      const branches = data?.branches ?? []
      setImageSrc(getBackgroundForBranch(branches, activeBranchIndex, section, is4K))
    }
    updateBg()
    window.addEventListener('resize', updateBg)
    return () => window.removeEventListener('resize', updateBg)
  }, [data, activeBranchIndex, section])

  useEffect(() => {
    loadData('actual-info.json').then(setData)
  }, [])

  const handleBack = () => navigate('/actual-info')

  const isWork = section === 'work'
  const isTime = section === 'time'
  const isMeetings = section === 'meetings'

  useEffect(() => {
    if (!isWork && !isTime && !isMeetings) navigate('/actual-info')
  }, [section, isWork, isTime, isMeetings, navigate])

  useEffect(() => {
    setTimePage(1)
  }, [activeBranchIndex])

  if (!isWork && !isTime && !isMeetings) return null

  const branches = data?.branches ?? []
  const buttons = branches.map((b) => b.name)
  const activeColors = branches.map((b) => b.color)
  const activeBranch = branches[activeBranchIndex]
  const workInfo = activeBranch?.workInfo
  const practicalInfo = activeBranch?.practicalInfo
  const scheduleContent = data?.scheduleContent

  const pageSectionClass = isWork ? styles.pageWork : isTime ? styles.pageTime : styles.pageMeetings
  const contentSectionClass = isWork ? styles.contentWork : isTime ? styles.contentTime : styles.contentMeetings
  const rightSectionClass = isWork ? styles.rightColumnWork : isTime ? styles.rightColumnTime : styles.rightColumnMeetings

  return (
    <div className={`${styles.page} ${pageSectionClass}`}>
      {imageSrc && (
        <div className={styles.background} style={{ backgroundImage: `url(${imageSrc})` }} />
      )}
      <div className={`${styles.content} ${contentSectionClass}`}>
        <div className={styles.leftColumn}>
          {data && (
            <BlockButtons
              title=""
              buttons={buttons}
              onBack={handleBack}
              activeIndex={activeBranchIndex}
              activeColors={activeColors}
              onButtonClick={setActiveBranchIndex}
            />
          )}
        </div>
        <div className={`${styles.rightColumn} ${rightSectionClass}`}>
          {!data && <div className={styles.textContent}>Загрузка...</div>}
          {data && isWork && (
            <>
              {workInfo && (
                <div className={`${styles.textContent} ${styles.workTextBlock}`}>
                  {renderWorkInfo(workInfo)}
                </div>
              )}
              <button
                type="button"
                className={`${Sharedstyles.universalButton} ${styles.primaryButton}`}
                onClick={() => setModalOpen(true)}
              >
                узнать подробнее
              </button>

            </>
          )}
          {data && isTime && (() => {
            const exhibitions = activeBranch?.exhibitions ?? []
            const totalPages = Math.max(1, Math.ceil(exhibitions.length / EXHIBITIONS_PER_PAGE))
            const start = (timePage - 1) * EXHIBITIONS_PER_PAGE
            const itemsOnPage = exhibitions.slice(start, start + EXHIBITIONS_PER_PAGE)
            return (
              <>
                <div className={styles.timeItemsGrid}>
                  {itemsOnPage.map((item) => (
                    <article key={item.id} className={styles.timeItem}>
                      <div className={styles.timeItemHeader}>
                        <span className={styles.timeItemDate}>{item.date}</span>
                        <button type="button" className={styles.timeWatchButton}>
                          смотреть
                        </button>
                      </div>
                      <div className={styles.timeWrapperItem}>
                        <div className={styles.timeItemImage} />
                        <h3 className={styles.timeItemTitle}>{item.title}</h3>
                      </div>
                    </article>
                  ))}
                </div>
                {exhibitions.length > EXHIBITIONS_PER_PAGE && (
                  <div className={styles.timePagination}>
                    <button
                      type="button"
                      className={styles.timePaginationArrow}
                      onClick={() => setTimePage((p) => Math.max(1, p - 1))}
                      disabled={timePage <= 1}
                    >
                      ‹
                    </button>
                    <span className={styles.timePageCount}>
                      {timePage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      className={styles.timePaginationArrow}
                      onClick={() => setTimePage((p) => Math.min(totalPages, p + 1))}
                      disabled={timePage >= totalPages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )
          })()}
          {data && isMeetings && (
            <div className={styles.textContent}>
              {renderScheduleContent(scheduleContent)}
            </div>
          )}
        </div>
      </div>

      {modalOpen && data && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>практическая информация</h2>
              <button type="button" className={styles.modalClose} onClick={() => setModalOpen(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {practicalInfo?.sections?.length
                ? renderPracticalInfo(practicalInfo)
                : renderWorkInfo(workInfo)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActualInfoSection
