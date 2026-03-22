import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import headerBg from '../../assets/background_header_img.png'
import headerBg4k from '../../assets/background_header_img-4k.png'
import styles from './Header.module.css'

const ROUTE_TITLES = {
  '/': 'Входная зона',
  '/menu-map': 'Структура музея',
  '/service-building': 'Интерактивный план',
  '/main-house': 'Интерактивный план',
  '/collection': 'коллекции',
  '/scientific-activity': 'научная деятельность',
  '/educational-programs': 'образовательные программы',
  '/objects-branches': 'филиалы и объекты',
  '/actual-info': 'актуальная информация',
  '/actual-info/work': 'режим работы филиалов и объектов',
  '/actual-info/time': 'временные выставки',
  '/actual-info/meetings': 'мероприятия',
}

const ACTUAL_INFO_HEADER_ROUTES = ['/actual-info/work', '/actual-info/time', '/actual-info/meetings']

/** Заголовок для вложенных путей, когда нет точного совпадения в ROUTE_TITLES */
function getPrefixFallbackTitle(pathname) {
  if (pathname.startsWith('/collection')) return ROUTE_TITLES['/collection']
  if (pathname.startsWith('/objects-branches')) return ROUTE_TITLES['/objects-branches']
  if (pathname.startsWith('/service-building')) return ROUTE_TITLES['/service-building']
  if (pathname.startsWith('/main-house')) return ROUTE_TITLES['/main-house']
  return ''
}

const Header = () => {
  const location = useLocation()
  const [headerBgSrc, setHeaderBgSrc] = useState(null)

  const title =
    (location.state?.pageTitle ??
      ROUTE_TITLES[location.pathname] ??
      (location.pathname.startsWith('/actual-info') ? 'актуальная информация' : '')) ||
    getPrefixFallbackTitle(location.pathname)
  const titleColor = location.state?.pageTitleColor
  const useActualInfoHeader = ACTUAL_INFO_HEADER_ROUTES.includes(location.pathname)

  useEffect(() => {
    if (!useActualInfoHeader) {
      setHeaderBgSrc(null)
      return
    }
    const updateBg = () => {
      const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
      setHeaderBgSrc(is4K ? headerBg4k : headerBg)
    }
    updateBg()
    window.addEventListener('resize', updateBg)
    return () => window.removeEventListener('resize', updateBg)
  }, [useActualInfoHeader])

  const headerStyle = useActualInfoHeader && headerBgSrc
    ? {
        backgroundImage: `url(${headerBgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : undefined

  return (
    <div
      className={`${styles.header} ${useActualInfoHeader ? styles.headerActualInfoSection : ''}`.trim()}
      style={headerStyle}
    >
      <h1
        className={`${styles.title} ${useActualInfoHeader ? styles.titleActualInfoSection : ''}`.trim()}
        style={titleColor ? { color: titleColor } : undefined}
      >
        {title}
      </h1>
    </div>
  )
}

export default Header
