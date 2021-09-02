import rowHelper from '@/models/Table/rowHelper'
import { IJSONApp } from './../../models/appHelper'
import { IJSONRow } from '@/types/IJSONRow'
import { IApi } from './types'

export class ApiService implements IApi {

  constructor (public app: IJSONApp) {

  }

  async addRow (data: { app: string; tableId: string; data: IJSONRow }): Promise<IJSONRow | false> {

    // 字段名称 使用id 还是 使用具名
    // 字段名称 不存在是创建 还是 抛弃
    // 新增还是追加   判断依据是什么

    if (this.app.tables[data.tableId]) {

      const primaryField = this.app.tables[data.tableId].primaryField

      const realRow: Partial<IJSONRow> = {}
      Object.keys(data.data).forEach(k => {
        const realKey = this.getFieldNameByLabelName(data.tableId, k)
        if (realKey) {
          realRow[realKey] = data.data[k]
        }
      })

      // if (realRow[primaryField]) {

      // 不重复添加
      const existRow = await this.findRow({ app: data.app, tableId: data.tableId, query: { url: realRow[primaryField] } })
      if (existRow) {
        return false
      }
      // }

      return rowHelper.addRow(this.app.tables[data.tableId], realRow)
    } else {
      return false
    }
  }

  getFieldNameByLabelName (tableId: string, label: string) {
    return Object.values(this.app.tables[tableId].fields).find(it => it.name === label)?.id
  }

  async findRow (data: { app: string; tableId: string; query: Partial<IJSONRow> }): Promise<IJSONRow | null> {
    console.log('data', data)
    // 精确匹配、模糊匹配
    // 条件是字段名、条件是具名
    this.app.tables[data.tableId].rows
    if (this.app.tables[data.tableId]) {

      const r = Object.values(this.app.tables[data.tableId].rows).find(it => {
        for (const k in data.query) {
          const fieldName = this.getFieldNameByLabelName(data.tableId, k)
          if (!fieldName) {
            return false
          }
          if (it[fieldName] !== data.query[k]) {
            return false
          }
        }
        return true
      })

      return r || null
    } else {
      return null
    }
  }
}