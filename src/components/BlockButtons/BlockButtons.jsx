import styles from './BlockButtons.module.css'
import sharedStyles from '../../styles/styles.module.css'

const BlockButtons = ({
  title,
  buttons = [],
  onBack,
  activeIndex = -1,
  activeColors = [],
  onButtonClick,
}) => (
  <div className={styles.blockButtons}>
    <div className={styles.buttonsWrap}>
      {title && <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />}
      {buttons.length > 0 && (
        <ul className={styles.buttonsList}>
          {buttons.map((label, index) => {
            const isActive = activeIndex === index
            const activeColor = activeColors[index]
            return (
              <li key={label}>
                <button
                  type="button"
                  className={`${styles.itemButton} ${isActive ? styles.itemButtonActive : ''}`.trim()}
                  style={
                    isActive && activeColor
                      ? { color: activeColor, fontWeight: 700 }
                      : isActive
                        ? { fontWeight: 700 }
                        : undefined
                  }
                  onClick={onButtonClick ? () => onButtonClick(index) : undefined}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
    <div className={styles.backWrap}>
      <button type="button" className={sharedStyles.universalButton} onClick={onBack}>
        назад
      </button>
    </div>
  </div>
)

export default BlockButtons
