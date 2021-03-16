import libs from '@/libs'
import Vue from 'vue'
import { IJSONTable } from './Table'

export interface IJSONRow {
  /** 行主键 */
  _id: string
  [key: string]: string | number
}


/** 获取一个表格唯一id */
function generateRowId(table: IJSONTable): string {
  let isUnique = false
  let id = libs.randomChar()
  while (!isUnique) {
    if (!table.rows[id]) {
      isUnique = true
      break
    } else {
      id = libs.randomChar()
    }
  }
  return id
}

function addRow(table: IJSONTable) {


  const row: IJSONRow = {
    _id: generateRowId(table),
  }



  for (const fieldId in table.fields) {
    const field = table.fields[fieldId]
    row[fieldId] = ''
  }

  //需要通过Vue给不存在的属性添加响应式
  Vue.set(table.rows, row._id, row)

  for (const viewId in table.views) {
    const view = table.views[viewId]
    view.rowsSorts.push(row._id)
  }
}

const row = {
  generateRowId,
  addRow,
}

export default row