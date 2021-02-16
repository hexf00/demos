import libs from '@/libs'
import { IApp } from '../App/App'
import view, { IView } from '../View/View'
import { ITableField } from './TableField'
import { IRow } from './Row'
import Vue from 'vue'


export interface ITable {
  /** 表主键 */
  _id: string
  /** 表名称 */
  name: string
  /** 表描述 */
  description: string
  /** 表字段配置 */
  fields: Record<string, ITableField>
  /** 表数据 */
  rows: Record<string, IRow>
  /** 表视图 */
  views: Record<string, IView>
  /** 表视图排序 */
  viewsSorts: string[]
}

/** 获取一个表格唯一id */
function generateTableId(app: IApp): string {
  let isUnique = false
  let id = libs.randomChar()
  while (!isUnique) {
    if (!app.tables[id]) {
      isUnique = true
      break
    } else {
      id = libs.randomChar()
    }
  }
  return id
}

/** 检查表名称在app中是否存在 */
function checkTableNameIsExist(app: IApp, name: string): boolean {
  for (const tableId in app.tables) {
    const table = app.tables[tableId]
    if (table.name === name) {
      return true
    }
  }
  return false
}

/** 返回一个app中未被使用的表名称 */
function generateTableName(app: IApp): string {
  let isUnique = false
  let index = app.tableSorts.length + 1
  while (!isUnique) {
    if (!checkTableNameIsExist(app, `未命名数据表 ${index}`)) {
      isUnique = true
      break
    } else {
      index++
    }
  }
  return `未命名数据表 ${index}`
}


function addTable(app: IApp) {
  const table: ITable = {
    _id: generateTableId(app),
    name: generateTableName(app),
    description: '',
    fields: {},
    rows: {},
    views: {},
    viewsSorts: [],
  }

  //添加默认视图
  view.addView(table)

  //需要通过Vue给不存在的属性添加响应式
  Vue.set(app.tables, table._id, table)
  app.tableSorts.push(table._id)
}

function removeTable(app: IApp, table: ITable) {
  delete app.tables[table._id]

  const index = app.tableSorts.indexOf(table._id)
  if (index !== -1) {
    app.tableSorts.splice(index, 1)
  }
}

const table = {
  addTable,
  removeTable,
  checkTableNameIsExist,
}

export default table