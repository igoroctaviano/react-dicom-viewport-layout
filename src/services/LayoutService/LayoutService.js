import { PubSub, ViewportLayout, ViewportGridLayout } from '../../classes'
import { create3PlaneLayout } from '../../utils'

/**
 * Constants
 */

const DEFAULT_LAYOUT = 'grid-1x1'
const _sharedInstance = Symbol('sharedInstance')
const _defaultViewportLayouts = Symbol('defaultViewportLayouts')
const _mode = Symbol('mode')
const _layout = Symbol('layout')
const _content = Symbol('content')
const _selected = Symbol('selected')

const LayoutServiceModes = Object.freeze({
  Normal: Symbol('Normal'),
  MaximumViewportSpace: Symbol('MaximumViewportSpace')
})

export const LayoutServiceEvents = Object.freeze({
  ModeChanged: 'ModeChanged',
  LayoutChanged: 'LayoutChanged',
  ContentChanged: 'ContentChanged',
  SelectionChanged: 'SelectionChanged'
})

/**
 * Service responsible for maintaining general layout state
 * @class
 * @classdesc Maintain general layout state
 * @extends PubSub Provides subscribable events
 */
export default class LayoutService extends PubSub {
  constructor() {
    super()
    this[_mode] = LayoutServiceModes.Normal
    this[_layout] = null
    this[_content] = null
    this[_selected] = 0
    this.setLayout(LayoutService.getDefaultViewportLayoutById(DEFAULT_LAYOUT))
  }

  /**
   * Returns the currently selected layout mode
   * @returns {Symbol} The currently selected layout mode
   */
  get mode() {
    return this[_mode]
  }

  /**
   * Returns the layout currently set
   * @returns {Symbol} The currently selected layout mode
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
   * Toggle between available layout modes
   * @returns {Symbol} The newly selected mode
   */
  toggleViewerMode() {
    const modes = Object.values(LayoutServiceModes)
    const index = (modes.indexOf(this[_mode]) + 1) % modes.length
    this[_mode] = modes[index]
    this.publish(LayoutServiceEvents.ModeChanged, this[_mode])
    return this[_mode]
  }

  /**
   * Change viewport layout of the viewer
   * @fires LayoutService.Events.LayoutChanged
   * @param {ViewportLayout} newLayout The new viewport layout;
   * @param {boolean} discard Flag
   * @returns {boolean} Returns true if the layout was successfully updated or
   *  false otherwise
   */
  setLayout(newLayout, discard = false) {
    const oldLayout = this[_layout]
    if (newLayout instanceof ViewportLayout && newLayout !== oldLayout) {
      this[_layout] = newLayout
      this.resetContent(!discard)
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
  setDefaultLayoutById(id, discard = false) {
    return this.setLayout(
      LayoutService.getDefaultViewportLayoutById(id),
      discard
    )
  }

  /**
   * Reset the internal content list of viewport content to match the currently
   * selected amount of viewports defined by the selected layout
   * @param {boolean} preserve Flag to determine if the contents of resized
   * list should be preserved;
   * @returns {void} Nothing meaningful is returned
   */
  resetContent(preserve = false) {
    const { length } = this[_layout]
    const oldContent = this[_content]
    const oldContentLength = oldContent !== null ? oldContent.length : 0
    const shouldCopy = preserve && oldContentLength > 0
    const newContent = new Array(length)
    for (let i = 0; i < length; ++i) {
      newContent[i] = shouldCopy && i < oldContentLength ? oldContent[i] : null
    }
    this[_content] = newContent
    this.setSelected(Math.min(this.selected, length - 1))
  }

  /**
   * Associate arbitrary content with the viewport box at the given index
   * @param {number} index The index of the associated viewport
   * @param {any} data The content to be associated with a viewport
   * @returns {void} Nothing meaningful is returned
   */
  setContent(index, data) {
    const content = this[_content]
    if (
      content instanceof Array &&
      (index |= 0) >= 0 &&
      index < content.length
    ) {
      const oldData = content[index]
      content[index] = data
      this.publish(LayoutServiceEvents.ContentChanged, index, data, oldData)
    }
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
   * Retrieve a list with the indices of every viewport box whose associated
   * content has been set (i.e., is not null)
   * @returns {Array<number>} A (possibly empty) list of indices
   */
  getViewportIndicesWithContent() {
    const indices = []
    const content = this[_content]
    if (content instanceof Array) {
      const { length } = content
      for (let i = 0; i < length; ++i) {
        if (content[i] !== null) {
          indices.push(i)
        }
      }
    }
    return indices
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

  /*
   * Static
   */

  static Modes = LayoutServiceModes
  static Events = LayoutServiceEvents

  /**
   * Retrieve a reference to a globally shared instance of the LayoutService
   * class
   * @returns {LayoutService} A reference to a globally shared instance of
   *  the LayoutService class
   */
  static getSharedInstance() {
    let sharedInstance = LayoutService[_sharedInstance]
    if (!(sharedInstance instanceof LayoutService)) {
      sharedInstance = new LayoutService()
      LayoutService[_sharedInstance] = sharedInstance
    }
    return sharedInstance
  }

  /**
   * Retrieve a list of default viewport layouts
   * @returns {Array<ViewportLayout>} A reference to a globally shared list of
   *  default layouts
   */
  static getDefaultViewportLayouts() {
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
  static getDefaultViewportLayoutById(id) {
    const layouts = LayoutService.getDefaultViewportLayouts()
    for (let i = 0; i < layouts.length; ++i) {
      const layout = layouts[i]
      if (layout.id === id) {
        return layout
      }
    }
    return null
  }
}
