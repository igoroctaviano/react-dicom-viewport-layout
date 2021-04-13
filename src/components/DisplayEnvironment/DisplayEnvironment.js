import React, { useEffect, useMemo, useState } from 'react'

import LayoutSelector from '../LayoutSelector'
import { LayoutService } from '../../services'
import { getStyleFromSpatialPosition, layoutToViewports } from '../../utils'
import { LayoutServiceEvents } from '../../services/LayoutService/LayoutService'

import styles from './DisplayEnvironment.module.css'

const { LayoutChanged } = LayoutServiceEvents

const DisplayEnvironment = () => {
  const [viewports, setViewports] = useState([])

  useEffect(() => {
    LayoutService.setDefaultLayoutById('grid-2x2', true)

    const viewports = layoutToViewports(LayoutService.layout)
    setViewports(viewports)

    const onLayoutChangeHandler = (layout) => {
      const viewports = layoutToViewports(layout)
      setViewports(viewports)
    }

    LayoutService.subscribe(LayoutChanged, onLayoutChangeHandler)

    return () => {
      LayoutService.unsubscribe(LayoutChanged, onLayoutChangeHandler)
    }
  }, [])

  const getViewportBoxes = () =>
    viewports.map(({ spatialPosition, plugin }, viewportIndex) => {
      const viewportId = `empty-${viewportIndex}`
      const style = getStyleFromSpatialPosition(spatialPosition)

      const getViewport = (plugin) => <div>Test Viewport</div>
      const ViewportComponent = getViewport(plugin)

      return (
        <div
          className={styles.viewportBox}
          style={style}
          data-viewport-id={viewportId}
          key={viewportId}
        >
          {ViewportComponent}
        </div>
      )
    })

  const ViewportBoxes = useMemo(getViewportBoxes, [viewports])

  return (
    <div className={styles.displayEnvironmentWrapper}>
      <LayoutSelector />
      <div className={styles.displayEnvironment}>{ViewportBoxes}</div>
    </div>
  )
}

export default DisplayEnvironment
