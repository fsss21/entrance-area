import backgroundImg from '../../../assets/background_img.png'
import backgroundImg4k from '../../../assets/background_img-4k.png'
import utkinaImg from '../../../assets/utkina_dacha_back_img.png'
import utkinaImg4k from '../../../assets/utkina_dacha_back_img-4k.png'
import restavration from '../../../assets/restavration_back_img.png'
import restavration4k from '../../../assets/restavration_back_img-4k.png'
import literatorskie from '../../../assets/mostki_back_img.png'
import literatorskie4k from '../../../assets/mostki_back_img-4k.png'
import volkovo from '../../../assets/volkovskoe_back_img.png'
import volkovo4k from '../../../assets/volkovskoe_back_img-4k.png'
import nevsky19 from '../../../assets/nevski_19_back_img.png'
import nevsky194k from '../../../assets/nevski_19_back_img-4k.png'
import anikushin from '../../../assets/anikushin_back_img.png'
import anikushin4k from '../../../assets/anikushin_back_img-4k.png'
import interactivMapImg from '../../../assets/interactiv_map_back_img.png'
import interactivMapImg4k from '../../../assets/interactiv_map_back_img-4k.png'
import lavraImg from '../../../assets/lavra_back_img.png'
import lavraImg4k from '../../../assets/lavra_back_img-4k.png'

const mapPair = [interactivMapImg, interactivMapImg4k]

/** Пары [обычное, 4K] для backgroundId из objects-branches.json */
export const BRANCH_BACKGROUNDS = {
  interactiv_map: mapPair,
  lavra: [lavraImg, lavraImg4k],
  utkina: [utkinaImg, utkinaImg4k],
  restoration: [restavration, restavration4k],
  literatorskie: [literatorskie, literatorskie4k],
  volkovo: [volkovo, volkovo4k],
  nevsky19: [nevsky19, nevsky194k],
  anikushin: [anikushin, anikushin4k],
}

const defaultPair = [backgroundImg, backgroundImg4k]

export function getBranchBackgroundSrc(backgroundId, is4K = false) {
  const pair = (backgroundId && BRANCH_BACKGROUNDS[backgroundId]) || defaultPair
  return is4K ? pair[1] : pair[0]
}
