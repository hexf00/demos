import libs from '@/libs'
import { IJSONApp } from '../App/App'
import JsonView, { IView } from '../View/View'
import { IJSONField } from './Field'
import { IJSONRow } from './Row'
import Vue from 'vue'


export interface IJSONTable {
  /** 表主键 */
  _id: string
  /** 表名称 */
  name: string
  /** 表描述 */
  description: string
  /** 表字段配置 */
  fields: Record<string, IJSONField>
  /** 表数据 */
  rows: Record<string, IJSONRow>
  /** 表视图 */
  views: Record<string, IView>
  /** 表视图排序 */
  viewsSorts: string[]
}

/** 获取一个表格唯一id */
function generateTableId(app: IJSONApp): string {
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
function checkTableNameIsExist(app: IJSONApp, name: string): boolean {
  for (const tableId in app.tables) {
    const table = app.tables[tableId]
    if (table.name === name) {
      return true
    }
  }
  return false
}

/** 返回一个app中未被使用的表名称 */
function generateTableName(app: IJSONApp): string {
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


function addTable(app: IJSONApp) {
  const table: IJSONTable = {
    _id: generateTableId(app),
    name: generateTableName(app),
    description: '',
    fields: {},
    rows: {},
    views: {},
    viewsSorts: [],
  }

  //添加默认视图
  JsonView.addView(table)

  //需要通过Vue给不存在的属性添加响应式
  Vue.set(app.tables, table._id, table)
  app.tableSorts.push(table._id)
}

function removeTable(app: IJSONApp, table: IJSONTable) {
  delete app.tables[table._id]

  const index = app.tableSorts.indexOf(table._id)
  if (index !== -1) {
    app.tableSorts.splice(index, 1)
  }
}

const JsonTable = {
  addTable,
  removeTable,
  checkTableNameIsExist,
}

export default JsonTable