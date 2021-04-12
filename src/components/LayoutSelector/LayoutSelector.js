import React, { useCallback, useEffect, useMemo, useState } from 'react'

import LayoutButton from '../LayoutButton'
import { LayoutService } from '../../services'

import './LayoutSelector.css'

const LayoutSelector = () => {
  const [selectedLayout, setSelectedLayout] = useState(null)
  const layoutOptions = LayoutService.getDefaultViewportLayouts()

  const onClick = useCallback((layout) => {
    const layoutService = LayoutService.getSharedInstance()
    layoutService.setLayout(layout)
  }, [])

  const options = useMemo(() => {
    const buttons = []
    for (let i = 0; i < layoutOptions.length; ++i) {
      buttons.push(
        <LayoutButton layout={layoutOptions[i]} key={i} onClick={onClick} />
      )
    }
    return buttons
  }, [layoutOptions, onClick])

  useEffect(() => {
    const { LayoutChanged } = LayoutService.Events
    const layoutService = LayoutService.getSharedInstance()
    layoutService.subscribe(LayoutChanged, setSelectedLayout)
    setSelectedLayout(layoutService.layout)
    return () => {
      layoutService.unsubscribe(LayoutChanged, setSelectedLayout)
    }
  }, [])

  return (
    <div className='layout-selector'>
      {selectedLayout && <LayoutButton layout={selectedLayout} />}
      {options.length > 0 && (
        <div className='layout-selector-options'>{options}</div>
      )}
    </div>
  )
}

export default LayoutSelector
