export default class ViewportLayout extends Array {
  constructor(title, id) {
    super(0)
    Object.defineProperties(this, {
      title: { value: title },
      id: { value: id }
    })
  }

  /**
   * Adds an entry to the layout instance. An entry is an instance of the
   * Float64Array class with 4 elements "x, y, z, w", where "x,y" represent
   * the normalized coordinates of the upper left corner of the viewport and
   * "z,w" the lower right corner
   * @param {number} x x-coords of the upper left corner of the viewport
   * @param {number} y y-coords of the upper left corner of the viewport
   * @param {number} z x-coords of the lower right corner of the viewport
   * @param {number} w y-coords of the lower right corner of the viewport
   * @returns {number} The new length of the layout (number of viewports)
   */
  add(x, y, z, w) {
    /**
     * Using Float64Array to satisfy requirements from DICOM attribute
     * Display Environment Spatial Position (0072,0108)
     */
    const entry = new Float64Array(4)
    entry[0] = isNaN(x) ? 0.0 : x
    entry[1] = isNaN(y) ? 0.0 : y
    entry[2] = isNaN(z) ? 0.0 : z
    entry[3] = isNaN(w) ? 0.0 : w
    if (ViewportLayout.isValidEntry(entry)) {
      return this.push(entry)
    }
    return this.length
  }

  /**
   * Checks if a valid layout (i.e., a valid entry) exists on a given
   * position returning that layout on success on undefined on failure
   * @param {number} i The index of the desired layout
   * @returns {Float64Array} The layout found (a Float64Array[4]) or undefined
   */
  get(i) {
    /** Prevent deoptimizations caused by out-of-bounds access */
    if (i >= 0 && i < this.length) {
      const entry = this[i]
      if (ViewportLayout.isValidEntry(entry)) {
        return entry
      }
    }
  }

  /**
   * Static Methods
   */

  /**
   * Check if a given value is a valid entry
   * @param {any} subject The value being tested
   * @returns {boolean}
   */
  static isValidEntry(subject) {
    return (
      subject instanceof Float64Array &&
      subject.length === 4 &&
      subject[0] >= 0.0 &&
      subject[2] <= 1.0 &&
      subject[2] > subject[0] &&
      subject[1] <= 1.0 &&
      subject[3] >= 0.0 &&
      subject[3] < subject[1]
    )
  }
}
