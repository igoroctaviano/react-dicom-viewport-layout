import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ViewportLayout } from '../../classes'
import { getStyleFromSpatialPosition } from '../../utils'

import './LayoutButton.css'

const LayoutButton = ({ layout, onClick, showLabel, highlightedIndices }) => {
  const onClickHandler = onClick(layout)

  const boxes = []
  for (let i = 0; i < layout.length; ++i) {
    const spatialPosition = layout.get(i)
    if (spatialPosition) {
      boxes.push(
        <div
          className={classnames(
            'layout-button-icon-box',
            highlightedIndices.includes(i) ? 'highlighted' : ''
          )}
          style={getStyleFromSpatialPosition(spatialPosition)}
          key={i}
        />
      )
    }
  }

  return (
    <div className='layout-button' onClick={onClickHandler}>
      <div className='layout-button-icon'>{boxes}</div>
      {showLabel && <span className='layout-button-label'>{layout.title}</span>}
    </div>
  )
}

const noop = () => {};

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
