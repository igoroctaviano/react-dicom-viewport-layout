import React, { useEffect, useMemo, useState } from 'react'

import LayoutButton from '../LayoutButton'
import { LayoutService } from '../../services'

import styles from './LayoutSelector.module.css'

const LayoutSelector = () => {
  const [layout, setLayout] = useState(null)
  const layoutOptions = LayoutService.getDefaultViewportLayouts()

  const options = useMemo(() => {
    const buttons = []

    const onClickHandler = (layout) => {
      const layoutService = LayoutService.getSharedInstance()
      layoutService.setLayout(layout)
      debugger
    }

    for (let i = 0; i < layoutOptions.length; ++i) {
      buttons.push(
        <LayoutButton
          layout={layoutOptions[i]}
          key={i}
          onClick={onClickHandler}
        />
      )
    }
    return buttons
  }, [layoutOptions])

  useEffect(() => {
    const { LayoutChanged } = LayoutService.Events
    const layoutService = LayoutService.getSharedInstance()
    layoutService.subscribe(LayoutChanged, setLayout)
    setLayout(layoutService.layout)
    return () => {
      layoutService.unsubscribe(LayoutChanged, setLayout)
    }
  }, [])

  return (
    <div className={styles.layoutSelector}>
      {layout && <LayoutButton layout={layout} />}
      {options.length > 0 && (
        <div className={styles.layoutOptions}>{options}</div>
      )}
    </div>
  )
}

export default LayoutSelector
