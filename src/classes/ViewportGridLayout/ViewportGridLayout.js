import ViewportLayout from '../ViewportLayout'
import { createGridLayout, getSuitableGridLayout } from '../../utils'

export default class ViewportGridLayout extends ViewportLayout {
  constructor(rows, columns) {
    super(`Grid ${rows}x${columns}`, `grid-${rows}x${columns}`)
    this.rows = Math.max(1, rows | 0)
    this.columns = Math.max(1, columns | 0)
    createGridLayout(this, rows, columns)
    Object.freeze(this)
  }

  static for(count) {
    const { rows, columns } = getSuitableGridLayout(count)
    return new ViewportGridLayout(rows, columns)
  }
}
