import libs from '@/libs'
import { IJSONApp } from '../App/App'
import JsonView from '../View/View'
import fieldHelper from './fieldHelper'
import Vue from 'vue'
import { IJSONTable } from '../../types/IJSONTable'


/** 获取一个表格唯一id */
function generateTableId (app: IJSONApp): string {
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
function checkTableNameIsExist (app: IJSONApp, name: string): boolean {
  for (const tableId in app.tables) {
    const table = app.tables[tableId]
    if (table.name === name) {
      return true
    }
  }
  return false
}

/** 返回一个app中未被使用的表名称 */
function generateTableName (app: IJSONApp): string {
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


function addTable (app: IJSONApp) {
  const table: IJSONTable = {
    id: generateTableId(app),
    name: generateTableName(app),
    description: '',
    fields: {},
    rows: {},
    views: {},
    viewsSorts: [],
  }

  //添加默认视图
  JsonView.addView(table)

  fieldHelper.addField(table)

  //需要通过Vue给不存在的属性添加响应式
  Vue.set(app.tables, table.id, table)
  app.tableSorts.push(table.id)
}

function removeTable (app: IJSONApp, table: IJSONTable) {
  delete app.tables[table.id]

  const index = app.tableSorts.indexOf(table.id)
  if (index !== -1) {
    app.tableSorts.splice(index, 1)
  }
}

const tableHelper = {
  addTable,
  removeTable,
  checkTableNameIsExist,
}

export default tableHelper