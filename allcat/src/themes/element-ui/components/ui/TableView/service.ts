import { ITableView } from './components/VexCustomTable/types'
import { IView } from '@/models/View/View'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONTable } from '@/types/IJSONTable'

export default class TableViewService implements ITableView {

  selected: IJSONRow[] = []

  /** 正在被编辑的行 */
  inEditRow: IJSONRow | null = null

  callbacks: {
    scrollToRow?: (row: IJSONRow) => void
    scrollTo?: (pos: { x: number; y: number }) => void
  } = {}

  constructor (public table: IJSONTable, public view: IView) {

  }

  bindScrollToRow (fn: (row: IJSONRow) => void) {
    this.callbacks.scrollToRow = fn
  }

  bindScrollTo (fn: (pos: { x: number; y: number }) => void) {
    this.callbacks.scrollTo = fn
  }

  getScrollPos (): { x: number; y: number } {
    const { x, y } = JSON.parse(localStorage.getItem(`ScrollPos_${this.table.id}_${this.view.id}`) || '{"x":0,"y":0}')
    return { x, y }
  }

  onScroll ({ x, y }: { x: number; y: number }) {
    localStorage.setItem(`ScrollPos_${this.table.id}_${this.view.id}`, JSON.stringify({ x, y }))
  }
}