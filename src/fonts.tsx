import { library as FontLibrary } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

export function loadFonts() {
	FontLibrary.add(fas)
	FontLibrary.add(fab)
}

export default loadFonts
