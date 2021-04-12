import { ViewportLayout } from '../classes';

/**
 * Populate a given ViewportLayout instance with boxes for a regular 3-plane
 * layout;
 * @param {ViewportLayout} layout The target ViewportLayout instance;
 * @returns {ViewportLayout} A reference to the given layout instance;
 */
function create3PlaneLayout(layout) {
  if (layout instanceof ViewportLayout) {
    layout.add(0.0, 1.0, 0.5, 0.5)
    layout.add(0.0, 0.5, 0.5, 0.0)
    layout.add(0.5, 1.0, 1.0, 0.0)
    return layout
  }
  return null
}

export default create3PlaneLayout
