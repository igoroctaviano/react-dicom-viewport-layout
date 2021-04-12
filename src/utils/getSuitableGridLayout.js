/**
 * Calculate rows and columns for a grid layout which is big enough to hold the
 * given number of viewports
 * @param {number} count The required number of viewports
 * @returns {object} An object containing the properties rows and columns;
 */
function getSuitableGridLayout(count) {
  let rows = 1
  let columns = 1
  if ((count |= 0) >= 2) {
    columns = Math.ceil(Math.sqrt(count))
    rows = count === 2 ? 1 : columns
  }
  return Object.freeze({ rows, columns })
}

export default getSuitableGridLayout
