import { ISortRule } from '@/models/View/ViewSorter'
import { IJSONRow } from '@/types/IJSONRow'

/** 多条件排序，计算rate后排序 */
export function sortFun (rules: ISortRule[]) {
  return (itemA: IJSONRow, itemB: IJSONRow) => {
    const result = rules.reduce((result, rule, index) => {
      const { field, type } = rule
      const [a, b] = type === 'asc' ? [itemA, itemB] : [itemB, itemA]
      result += (10 ** (rules.length - index)) * (String(a[field] ? a[field] : '').localeCompare(String(b[field] ? b[field] : '')))

      return result
    }, 0)

    return result
  }
}

// 算法二
// let rateA = 0
// let rateB = 0
// rules.forEach((rule, index) => {
//   const { field, type } = rule
//   const [a, b] = type === 'asc' ? [itemA, itemB] : [itemB, itemA]
//   const result = (String(a[field] ? a[field] : '').localeCompare(String(b[field] ? b[field] : '')))
//   if (result > 0) {
//     rateA += (10 ** (rules.length - index))
//   } else {
//     rateB += (10 ** (rules.length - index))
//   }
//   return result
// })
// return rateA - rateB