import { ISortRule } from '@/models/View/ViewSorter'
import { EFieldType } from '@/types/EType'
import { IJSONRow } from '@/types/IJSONRow'

/** 多条件排序，计算rate后排序 */
export function sortFun (rules: ISortRule[]) {
  return (itemA: IJSONRow, itemB: IJSONRow) => {
    const result = rules.reduce((result, rule, index) => {
      const { field, type } = rule
      const [a, b] = type === 'asc' ? [itemA, itemB] : [itemB, itemA]

      if (field.type === EFieldType.select) {
        if (field.isMulti) {
          result += (10 ** (rules.length - index)) * (String(a[field.id] ? a[field.id] : '').localeCompare(String(b[field.id] ? b[field.id] : '')))
        } else {

          // 按排序比较
          const aIndex = a[field.id] ? field.selectOptions.findIndex(it => it.value === a[field.id]) : -1
          const bIndex = a[field.id] ? field.selectOptions.findIndex(it => it.value === b[field.id]) : -1

          console.log(aIndex, bIndex)

          if (aIndex !== bIndex) {
            result += (10 ** (rules.length - index)) * (aIndex < bIndex ? 1 : -1)
          }
        }
      } else {
        result += (10 ** (rules.length - index)) * (String(a[field.id] ? a[field.id] : '').localeCompare(String(b[field.id] ? b[field.id] : '')))
      }

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