/**
 * Get the CSS style object based on a Spatial Position vector
 * @param {Float64Array} spatialPosition A vec4 with coordinates for 2 points
 * @returns {object} An object with left, top, right, bottom properties or null
 */
function getStyleFromSpatialPosition(spatialPosition) {
  if (spatialPosition instanceof Float64Array && spatialPosition.length === 4) {
    const [left, top, right, bottom] = Array.prototype.map.call(
      spatialPosition,
      (s, i) => {
        if (i === 1 || i === 2) s = 1.0 - s
        /** Fixed to prevent rounding issues */
        return (s * 100.0).toFixed(4) + '%'
      }
    )
    return Object.freeze({ left, top, right, bottom })
  }
  return null
}

export default getStyleFromSpatialPosition
