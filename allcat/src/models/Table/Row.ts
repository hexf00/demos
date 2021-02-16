export interface IRow {
  /** 行主键 */
  _id: string
  [key: string]: string | number
}