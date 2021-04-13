import { PubSub, ViewportLayout, ViewportGridLayout } from '../../classes'
import { create3PlaneLayout } from '../../utils'

/**
 * Constants
 */

const DEFAULT_LAYOUT = 'grid-1x1'
const _defaultViewportLayouts = Symbol('defaultViewportLayouts')
const _layout = Symbol('layout')
const _selected = Symbol('selected')

const LayoutServiceEvents = Object.freeze({
  LayoutChanged: 'LayoutChanged',
  SelectionChanged: 'SelectionChanged'
})

/**
 * Service responsible for maintaining general layout state
 * @class
 * @classdesc Maintain general layout state
 * @extends PubSub Provides subscribable events
 */
class LayoutService extends PubSub {
  constructor() {
    super()
    this[_layout] = null
    this[_selected] = 0
    this.setLayout(this.getDefaultViewportLayoutById(DEFAULT_LAYOUT))
  }

  /**
   * Returns the layout currently set
   * @returns {Symbol} The currently selected layout
   */
  get layout() {
    return this[_layout]
  }

  /**
   * Returns the index of the currently selected viewport
   */
  get selected() {
    return this[_selected]
  }

  /**
   * Change viewport layout of the viewer
   * @fires LayoutService.Events.LayoutChanged
   * @param {ViewportLayout} newLayout The new viewport layout
   * @returns {boolean} Returns true if the layout was successfully updated or
   *  false otherwise
   */
  setLayout(newLayout) {
    const oldLayout = this[_layout]
    if (newLayout instanceof ViewportLayout && newLayout !== oldLayout) {
      this[_layout] = newLayout
      this.publish(LayoutServiceEvents.LayoutChanged, newLayout, oldLayout)
      return true
    }
    return false
  }

  /**
   * Change viewport layout of the viewer by specifying the id of a default
   * layout
   * @param {ViewportLayout} newLayout The new viewport layout
   * @returns {boolean} Returns true if the layout was successfully updated or
   *  false otherwise
   */
  setDefaultLayoutById(id) {
    const layout = this.getDefaultViewportLayoutById(id)
    return this.setLayout(layout)
  }

  /**
   * Retrieve data associated with the given viewport index
   * @param {number} index The index of the associated viewport
   * @returns {any} The data associated with the given viewport index or null
   */
  getContent(index) {
    const content = this[_content]
    if (
      content instanceof Array &&
      (index |= 0) >= 0 &&
      index < content.length
    ) {
      return content[index]
    }
    return null
  }

  /**
   * Update currently selected viewport index
   * @param {number} index The index of the new selected viewport
   */
  setSelected(index) {
    const { length } = this[_layout]
    const previous = this[_selected]
    if ((index |= 0) >= 0 && index < length && index !== previous) {
      this[_selected] = index
      this.publish(
        LayoutServiceEvents.SelectionChanged,
        this[_selected],
        previous
      )
    }
  }

  /**
   * Retrieve a list of default viewport layouts
   * @returns {Array<ViewportLayout>} A reference to a globally shared list of
   *  default layouts
   */
  getDefaultViewportLayouts() {
    let defaultViewportLayouts = LayoutService[_defaultViewportLayouts]
    if (!defaultViewportLayouts) {
      defaultViewportLayouts = Object.freeze([
        new ViewportGridLayout(1, 1),
        new ViewportGridLayout(1, 2),
        new ViewportGridLayout(1, 3),
        new ViewportGridLayout(2, 1),
        new ViewportGridLayout(2, 2),
        new ViewportGridLayout(2, 3),
        new ViewportGridLayout(3, 3),
        create3PlaneLayout(new ViewportLayout('3-Plane', '3-plane'))
      ])
      LayoutService[_defaultViewportLayouts] = defaultViewportLayouts
    }
    return defaultViewportLayouts
  }

  /**
   * Retrieves a default viewport layout by ID
   * @returns {ViewportLayout} The viewport layout with the given ID or null
   */
  getDefaultViewportLayoutById(id) {
    const layouts = this.getDefaultViewportLayouts()
    for (let i = 0; i < layouts.length; ++i) {
      const layout = layouts[i]
      if (layout.id === id) {
        return layout
      }
    }
    return null
  }

  /*
   * Static
   */

  static Events = LayoutServiceEvents
}

export { LayoutServiceEvents, LayoutService as LayoutServiceClass }

export default new LayoutService()
