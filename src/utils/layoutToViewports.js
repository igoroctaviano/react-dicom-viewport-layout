import { ViewportLayout } from '../classes'

/**
 * Build a viewport-list structure based on a given ViewportLayout instance
 * @param {ViewportLayout} layout The source ViewportLayout instance
 * @returns {Array} A viewport-list structure
 */
const layoutToViewports = (layout) => {
  const viewports = []
  if (layout instanceof ViewportLayout) {
    layout.forEach((spatialPosition) => {
      if (ViewportLayout.isValidEntry(spatialPosition)) {
        viewports.push({
          spatialPosition,
          plugin: 'cornerstone'
        })
      }
    })
  }
  return viewports
}

export default layoutToViewports
