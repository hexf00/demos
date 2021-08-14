import { ISelectOption } from '@/models/Table/fieldHelper'
import store from '@/store'
import { EFieldType, IFieldValue, IMultiValue } from '@/types/EType'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONRelationField, IJSONReverseRelationField } from '@/types/IJSONTableField'
import { IItemAction, NItemAction } from '@/types/IOptionAction'
import Vue from 'vue'
import BaseCellService from '../BaseCell/service'

export default class RelationCellService extends BaseCellService {
  /** 是否多选 */
  isMulti = false

  /** 选项 */
  selectOptions: ISelectOption[] = []

  constructor(public field: IJSONRelationField | IJSONReverseRelationField) {
    super()
    if (field.type === EFieldType.relation) {
      this.isMulti = field.isMulti
    } else {
      /** 反向映射类型 */
      this.isMulti = true
    }
  }

  toText (value: string): string {

    const relationTable = store.currentApp!.tables[this.field.relationTableId]
    if (!relationTable) {
      console.warn('失效引用:表丢失', value)
      return `表丢失,${value}`
    }

    const row = relationTable.rows[value]
    if (!row) {
      console.warn('失效引用:行丢失', value)
      return `行丢失,${value}`
    }
    // 删除数据需要联动删除，否则这里会报错
    // 表被删除
    // 行被删除
    return (row && row[relationTable.primaryField] as string) || '-'
  }

  /** 对比两次value 的变化动作 */
  diff (oldVal: IFieldValue | undefined, nowVal: IFieldValue | undefined): IItemAction[] {

    const convertToMultiValue = (val: IFieldValue | undefined): IMultiValue => {
      if (val === undefined) {
        return []
      } else if (Array.isArray(val)) {
        return val
      } else {
        return [val as string]
      }
    }

    const old = convertToMultiValue(oldVal)
    const now = convertToMultiValue(nowVal)

    const diffResult: IItemAction[] = []
    old.forEach(oldItem => {
      const sameItem = now.find(nowItem => oldItem === nowItem)
      if (!sameItem) {
        diffResult.push({ type: NItemAction.Type.Delete, value: oldItem })
      }
    })

    now.forEach(nowItem => {
      const sameItem = old.find(oldItem => nowItem === oldItem)
      if (!sameItem) {
        diffResult.push({ type: NItemAction.Type.Add, value: nowItem })
      }
    })

    return diffResult
  }

  setValue (val: IFieldValue, field: IJSONRelationField | IJSONReverseRelationField, row: IJSONRow) {
    const app = store.currentApp!
    const relationTable = app.tables[field.relationTableId]

    // 没有 关联字段 或者 反向关联字段
    if (!field.relationFieldId) {
      // 初始赋值不会响应，需要$set
      Vue.set(row, field.id, val)
      return
    }

    const relationField = relationTable.fields[field.relationFieldId] as IJSONRelationField

    const oldVal = row[this.field.id]
    const doAction = (action: IItemAction) => {

      const relationRow = relationTable.rows[action.value]

      if (action.type === NItemAction.Type.Add) {
        if (relationField.isMulti) {
          if (!relationRow[relationField.id]) {
            // 初始赋值不会响应，需要$set
            Vue.set(relationRow, relationField.id, [row.id])
          } else {
            const arr = relationRow[relationField.id] as IMultiValue
            const index = arr.indexOf(row.id)
            if (index === -1) {
              arr.push(row.id)
            }
          }
        } else {
          //TODO: 如果已经有值，需要替换、删除使用的地方
          relationRow[relationField.id] = row.id
        }
      } else if (action.type === NItemAction.Type.Delete) {
        if (relationField.isMulti) {
          if (relationRow[relationField.id]) {
            const arr = relationRow[relationField.id] as IMultiValue
            const index = arr.indexOf(row.id)
            if (index !== -1) {
              arr.splice(index, 1)
            }
          }
        } else {
          relationRow[relationField.id] = undefined
        }
      }
    }

    this.diff(oldVal, val).forEach(action => doAction(action))

    // 初始赋值不会响应，需要$set
    Vue.set(row, field.id, val)
  }
}