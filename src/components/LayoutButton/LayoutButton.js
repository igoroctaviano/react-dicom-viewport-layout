import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ViewportLayout } from '../../classes'
import { getStyleFromSpatialPosition } from '../../utils'

import styles from './LayoutButton.module.css'

const LayoutButton = ({ layout, onClick, showLabel, highlightedIndices }) => {
  const onClickHandler = onClick(layout)

  const boxes = []
  for (let i = 0; i < layout.length; ++i) {
    const spatialPosition = layout.get(i)
    if (spatialPosition) {
      boxes.push(
        <div
          className={classnames(
            styles.layoutButtonIconBox,
            highlightedIndices.includes(i) ? styles.highlighted : ''
          )}
          style={getStyleFromSpatialPosition(spatialPosition)}
          key={i}
        />
      )
    }
  }

  return (
    <div className={styles.layoutButton} onClick={onClickHandler}>
      <div className={styles.layoutButtonIcon}>{boxes}</div>
      {showLabel && (
        <span className={styles.layoutButtonLabel}>{layout.title}</span>
      )}
    </div>
  )
}

const noop = () => {}

LayoutButton.defaultProps = {
  showLabel: true,
  highlightedIndices: [],
  onClick: noop
}

LayoutButton.propTypes = {
  layout: PropTypes.instanceOf(ViewportLayout).isRequired,
  onClick: PropTypes.func,
  showLabel: PropTypes.bool,
  highlightedIndices: PropTypes.arrayOf(PropTypes.number)
}

export default LayoutButton
