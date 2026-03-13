import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import sharedStyles from '../../styles/styles.module.css'
import styles from './BranchMapView.module.css'

const VIEWPORT_4K_WIDTH = 3840

export default function BranchMapView({ branch, imageSrc, onBack }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedMonumentIds, setSelectedMonumentIds] = useState(() => new Set())
  const [selectedMemorialIds, setSelectedMemorialIds] = useState(() => new Set())
  const [searchInput, setSearchInput] = useState('')
  const [filterPanelPos, setFilterPanelPos] = useState({ top: 0, left: 0 })
  const [searchPanelPos, setSearchPanelPos] = useState({ top: 0, left: 0 })
  const [is4kViewport, setIs4kViewport] = useState(() => typeof window !== 'undefined' && window.innerWidth >= VIEWPORT_4K_WIDTH)
  const menuBtnRef = useRef(null)
  const searchBtnRef = useRef(null)

  const items = branch?.items ?? []
  const monumentItems = useMemo(() => items.filter((i) => i.name !== 'мемориальные доски'), [items])
  const memorialItems = useMemo(() => items.filter((i) => i.name === 'мемориальные доски'), [items])

  const filteredItems = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      return items.filter((item) => item.name.toLowerCase().includes(q))
    }
    const hasMonumentSelection = selectedMonumentIds.size > 0
    const hasMemorialSelection = selectedMemorialIds.size > 0
    if (!hasMonumentSelection && !hasMemorialSelection) return items
    return items.filter(
      (item) =>
        (item.name === 'мемориальные доски' && selectedMemorialIds.has(item.id)) ||
        (item.name !== 'мемориальные доски' && selectedMonumentIds.has(item.id))
    )
  }, [items, searchQuery, selectedMonumentIds, selectedMemorialIds])

  const openFilters = useCallback(() => {
    setSearchOpen(false)
    setFiltersOpen(true)
  }, [])
  const openSearch = useCallback(() => {
    setFiltersOpen(false)
    setSearchOpen(true)
  }, [])
  const closeAll = useCallback(() => {
    setFiltersOpen(false)
    setSearchOpen(false)
  }, [])

  const toggleMonument = (id) => {
    setSelectedMonumentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const toggleMemorial = (id) => {
    setSelectedMemorialIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const resetMonuments = () => setSelectedMonumentIds(new Set())
  const resetMemorials = () => setSelectedMemorialIds(new Set())

  const applyFilters = () => {
    setFiltersOpen(false)
  }

  const applySearch = () => {
    setSearchQuery(searchInput.trim())
    setSearchOpen(false)
  }

  const overlayVisible = filtersOpen || searchOpen

  useEffect(() => {
    if (!overlayVisible) return
    const onEscape = (e) => { if (e.key === 'Escape') closeAll() }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [overlayVisible, closeAll])

  useEffect(() => {
    if (!filtersOpen || !menuBtnRef.current) return
    const rect = menuBtnRef.current.getBoundingClientRect()
    const gap = 8
    setFilterPanelPos({ top: rect.bottom + gap, left: rect.left })
  }, [filtersOpen])

  useEffect(() => {
    if (!searchOpen || !searchBtnRef.current) return
    const rect = searchBtnRef.current.getBoundingClientRect()
    const gap = 8
    const panelWidth = 340
    setSearchPanelPos({ top: rect.bottom + gap, left: Math.max(16, rect.right - panelWidth) })
  }, [searchOpen])

  useEffect(() => {
    const onResize = () => setIs4kViewport(window.innerWidth >= VIEWPORT_4K_WIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className={styles.page}>
      <div
        className={styles.background}
        style={{ '--page-bg-image': imageSrc ? `url(${imageSrc})` : 'none' }}
      />
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <button
            ref={menuBtnRef}
            type="button"
            className={`${sharedStyles.universalButton} ${styles.iconBtn}`}
            onClick={openFilters}
            aria-expanded={filtersOpen}
            aria-label="Меню фильтров"
          >
            <MenuIcon fontSize="medium" />
          </button>
          <button
            ref={searchBtnRef}
            type="button"
            className={`${sharedStyles.universalButton} ${styles.iconBtn}`}
            onClick={openSearch}
            aria-expanded={searchOpen}
            aria-label="Поиск"
          >
            <SearchIcon fontSize="medium" />
          </button>
        </div>

        <div className={styles.mapArea}>
          {filteredItems.map((item) => {
            const pos = (is4kViewport && item.position4k ? item.position4k : item.position) ?? {}
            return (
              <div
                key={item.id}
                className={styles.marker}
                style={{
                  '--marker-top': pos.top ?? '50%',
                  '--marker-left': pos.left ?? '50%',
                }}
                role="button"
                tabIndex={0}
                onClick={() => { }}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
              >
                <img
                  src={item.image}
                  alt=""
                  className={styles.markerImage}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )
          })}
        </div>

        <div className={styles.backWrap}>
          <button type="button" className={sharedStyles.universalButton} onClick={onBack}>
            назад
          </button>
        </div>
      </div>

      {overlayVisible && (
        <div className={styles.overlay} onClick={closeAll} role="presentation" aria-hidden />
      )}

      {filtersOpen && (
        <div
          className={styles.filterPanel}
          style={{
            '--filter-panel-top': `${filterPanelPos.top}px`,
            '--filter-panel-left': `${filterPanelPos.left}px`,
          }}
          role="dialog"
          aria-label="Фильтры"
        >
          <button
            type="button"
            className={styles.panelClose}
            onClick={closeAll}
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
          <div className={styles.filterPanelScroll}>
            <section className={styles.filterSection}>
              <div className={styles.filterSectionHeader}>
                <h3 className={styles.filterSectionTitle}>Памятники</h3>
                <button type="button" className={styles.resetLink} onClick={resetMonuments}>
                  Сбросить <ExpandLessIcon fontSize="small" className={styles.resetIcon} />
                </button>
              </div>
              <ul className={styles.checkboxList}>
                {monumentItems.map((item) => (
                  <li key={item.id}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedMonumentIds.has(item.id)}
                        onChange={() => toggleMonument(item.id)}
                      />
                      <span>{item.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
            <section className={styles.filterSection}>
              <div className={styles.filterSectionHeader}>
                <h3 className={styles.filterSectionTitle}>Мемориальные доски</h3>
                <button type="button" className={styles.resetLink} onClick={resetMemorials}>
                  Сбросить <ExpandLessIcon fontSize="small" className={styles.resetIcon} />
                </button>
              </div>
              <ul className={styles.checkboxList}>
                {memorialItems.map((item, idx) => (
                  <li key={item.id}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedMemorialIds.has(item.id)}
                        onChange={() => toggleMemorial(item.id)}
                      />
                      <span>Мемориальная доска {idx + 1}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <button
            type="button"
            className={styles.showButton}
            onClick={applyFilters}
          >
            ПОКАЗАТЬ
          </button>
        </div>
      )}

      {searchOpen && (
        <div
          className={styles.searchPanel}
          style={{
            '--search-panel-top': `${searchPanelPos.top}px`,
            '--search-panel-left': `${searchPanelPos.left}px`,
          }}
          role="dialog"
          aria-label="Поиск"
        >
          <button
            type="button"
            className={styles.panelClose}
            onClick={closeAll}
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
          <div className={styles.searchPanelBody}>
            <label className={styles.searchLabel}>
              Поиск по названию объекта
            </label>
            <input
              type="text"
              className={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Введите название..."
              autoFocus
            />
            <button
              type="button"
              className={styles.showButton}
              onClick={applySearch}
            >
              ПОКАЗАТЬ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
