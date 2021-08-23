import { ISortRule } from '@/models/View/ViewSorter'
import { IJSONRow } from '@/types/IJSONRow'

/** 多条件排序，计算rate后排序 */
export function sortFun (rules: ISortRule[]) {
  return (itemA: IJSONRow, itemB: IJSONRow) => {
    const result = rules.reduce((result, rule, index) => {
      const { field, type } = rule
      const [a, b] = type === 'asc' ? [itemA, itemB] : [itemB, itemA]
      if (typeof a === 'number' && typeof b === 'number') {
        // TODO:确认规则是否准确
        result += (10 ** (rules.length - index)) * (a > b ? 1 : -1)
      } else {

        result += (10 ** (rules.length - index)) * (String(a[field] ? a[field] : '').localeCompare(String(b[field] ? b[field] : '')))
      }

      return result
    }, 0)

    return result
  }
}