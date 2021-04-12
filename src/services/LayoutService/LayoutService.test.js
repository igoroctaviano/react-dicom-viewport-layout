import { create3PlaneLayout } from '../../utils'
import { ViewportLayout } from '../../classes'
import LayoutService from './LayoutService'

describe('LayoutService', () => {
  describe('Singleton Interface', () => {
    it('should support for retrieval of a globally unique shared instance', () => {
      expect(LayoutService.getSharedInstance()).toBe(
        LayoutService.getSharedInstance()
      )
    })
  })

  describe('Viewer Mode', () => {
    it('should support for querying current viewer mode', () => {
      const layoutService = new LayoutService()
      expect(layoutService.mode).toBe(LayoutService.Modes.Normal)
    })

    it('should support for toggling through available viewer modes', () => {
      const layoutService = new LayoutService()
      expect(layoutService.toggleViewerMode()).toBe(
        LayoutService.Modes.MaximumViewportSpace
      )
      expect(layoutService.mode).toBe(LayoutService.Modes.MaximumViewportSpace)
      expect(layoutService.toggleViewerMode()).toBe(LayoutService.Modes.Normal)
      expect(layoutService.mode).toBe(LayoutService.Modes.Normal)
    })

    it('should trigger an event when the current viewer mode changes', () => {
      const layoutService = new LayoutService()
      const handler = jest.fn()
      layoutService.subscribe(LayoutService.Events.ModeChanged, handler)
      layoutService.toggleViewerMode()
      expect(handler).toHaveBeenCalledWith(
        LayoutService.Modes.MaximumViewportSpace
      )
    })
  })

  describe('Viewport Layout', () => {
    it('should provide a list of current viewport boxes', () => {
      const layoutService = new LayoutService()
      expect(layoutService.layout).toBeInstanceOf(ViewportLayout)
      expect(layoutService.layout.length).toBeGreaterThanOrEqual(1)
    })

    it('should support changing current layout while preserving state', () => {
      const layoutChangedHandler = jest.fn()
      const data = {}
      const layoutService = new LayoutService()
      const oldLayout = layoutService.layout
      const newLayout = create3PlaneLayout(new ViewportLayout())
      layoutService.setContent(0, data)
      layoutService.subscribe(
        LayoutService.Events.LayoutChanged,
        layoutChangedHandler
      )
      expect(layoutService.setLayout(newLayout)).toBe(true)
      expect(layoutChangedHandler).toHaveBeenCalledTimes(1)
      expect(layoutChangedHandler).toHaveBeenNthCalledWith(
        1,
        newLayout,
        oldLayout
      )
      expect(layoutService.getContent(0)).toBe(data)
    })

    it('should support changing current layout and reset state', () => {
      const layoutChangedHandler = jest.fn()
      const data = {}
      const layoutService = new LayoutService()
      const oldLayout = layoutService.layout
      const newLayout = create3PlaneLayout(new ViewportLayout())
      layoutService.setContent(0, data)
      layoutService.subscribe(
        LayoutService.Events.LayoutChanged,
        layoutChangedHandler
      )
      expect(layoutService.setLayout(newLayout, true)).toBe(true)
      expect(layoutChangedHandler).toHaveBeenCalledTimes(1)
      expect(layoutChangedHandler).toHaveBeenNthCalledWith(
        1,
        newLayout,
        oldLayout
      )
      expect(layoutService.getContent(0)).toBe(null)
    })
  })
})
