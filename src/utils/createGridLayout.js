import { ViewportLayout } from '../classes';

/**
 * Populate a given ViewportLayout instance with boxes for a grid layout with
 * the desired number of rows and columns
 * @param {ViewportLayout} layout The target ViewportLayout instance
 * @param {number} rows Number of rows
 * @param {number} columns Number of columns
 * @returns {number} The number of boxes created
 */
function createGridLayout(layout, rows, columns) {
  const count = rows * columns
  if (layout instanceof ViewportLayout && count > 0) {
    const xStep = 1 / columns
    const yStep = 1 / rows
    for (let i = 0; i < count; ++i) {
      const xOff = i % columns
      const yOff = rows - (i - xOff) / columns
      const xOrig = xOff * xStep
      const yOrig = yOff * yStep
      layout.add(xOrig, yOrig, xOrig + xStep, yOrig - yStep)
    }
    return count
  }
  return 0
}

export default createGridLayout
