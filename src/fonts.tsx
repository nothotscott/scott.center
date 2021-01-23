import { library as FontLibrary } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

export function loadFonts() {
	FontLibrary.add(fas)
}

export default loadFonts
