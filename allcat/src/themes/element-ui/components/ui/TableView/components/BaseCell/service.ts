import { IJSONTableField } from '@/types/IJSONTableField'

export default class BaseCellService {
  /** 控件类型 */
  static type: string

  constructor(public field: IJSONTableField) {

  }

}