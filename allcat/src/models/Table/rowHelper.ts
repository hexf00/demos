import libs from '@/libs'
import Vue from 'vue'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONTable } from '../../types/IJSONTable'
/** 获取一个表格唯一id */
function generateRowId (table: IJSONTable): string {
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

function addRow (table: IJSONTable) {


  const row: IJSONRow = {
    id: generateRowId(table),
  }



  for (const fieldId in table.fields) {
    const field = table.fields[fieldId]
    if (field.isMulti) {
      row[fieldId] = []
    } else {
      row[fieldId] = ''
    }
  }

  //需要通过Vue给不存在的属性添加响应式
  Vue.set(table.rows, row.id, row)

  for (const viewId in table.views) {
    const view = table.views[viewId]
    view.rowsSorts.push(row.id)
  }
  return row
}

function removeRow (table: IJSONTable, rows: IJSONRow[]) {
  rows.forEach(row => {
    delete table.rows[row.id]
    for (const viewId in table.views) {
      const view = table.views[viewId]
      const index = view.rowsSorts.findIndex(it => it === row.id)
      index !== -1 && view.rowsSorts.splice(index, 1)
    }
  })
}

const rowHelper = {
  generateRowId,
  addRow,
  removeRow,
}

export default rowHelper