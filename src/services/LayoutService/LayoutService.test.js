import { create3PlaneLayout } from '../../utils'
import { ViewportLayout } from '../../classes'
import LayoutService from './LayoutService'

describe('LayoutService', () => {
  describe('Viewport Layout', () => {
    it('should provide a list of current viewport boxes', () => {
      expect(LayoutService.layout).toBeInstanceOf(ViewportLayout)
      expect(LayoutService.layout.length).toBeGreaterThanOrEqual(1)
    })

    it('should support changing current layout while preserving state', () => {
      const layoutChangedHandler = jest.fn()
      const oldLayout = LayoutService.layout
      const newLayout = create3PlaneLayout(new ViewportLayout())
      LayoutService.subscribe(
        LayoutService.Events.LayoutChanged,
        layoutChangedHandler
      )
      expect(LayoutService.setLayout(newLayout)).toBe(true)
      expect(layoutChangedHandler).toHaveBeenCalledTimes(1)
      expect(layoutChangedHandler).toHaveBeenNthCalledWith(
        1,
        newLayout,
        oldLayout
      )
    })

    it('should support changing current layout and reset state', () => {
      const layoutChangedHandler = jest.fn()
      const oldLayout = LayoutService.layout
      const newLayout = create3PlaneLayout(new ViewportLayout())
      LayoutService.subscribe(
        LayoutService.Events.LayoutChanged,
        layoutChangedHandler
      )
      expect(LayoutService.setLayout(newLayout, true)).toBe(true)
      expect(layoutChangedHandler).toHaveBeenCalledTimes(1)
      expect(layoutChangedHandler).toHaveBeenNthCalledWith(
        1,
        newLayout,
        oldLayout
      )
    })
  })
})
