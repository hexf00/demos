import { IView } from '@/models/View/View'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONTable } from '@/types/IJSONTable'

export default class TableViewService {

  selected: IJSONRow[] = []

  constructor(public table: IJSONTable, public view: IView) {

  }
}