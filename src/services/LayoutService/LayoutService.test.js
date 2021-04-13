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
    })

    it('should support changing current layout and reset state', () => {
      const layoutChangedHandler = jest.fn()
      const layoutService = new LayoutService()
      const oldLayout = layoutService.layout
      const newLayout = create3PlaneLayout(new ViewportLayout())
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
    })
  })
})
