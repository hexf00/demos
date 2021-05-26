import { IViewField } from './ViewField'
import { IViewFilter } from './ViewFilter'
import { ITable } from '../Table/Table'
import libs from '@/libs'
import Vue from 'vue'

export interface IView {
  /** 视图主键 */
  _id: string
  /** 视图类型 */
  type: 'table' | 'kanban'
  /** 视图名称 */
  name: string
  /** 视图描述 */
  description: string
  /** 视图字段配置 */
  fields: IViewField[]
  /** 视图数据排序 */
  rowsSorts: string[]
  /** 过滤器 */
  filters: IViewFilter[]
}

/**
 * 获取一个视图唯一id
 */
function generateViewId(table: ITable): string {
  let isUnique = false
  let id = libs.randomChar()
  while (!isUnique) {
    if (!table.views[id]) {
      isUnique = true
      break
    } else {
      id = libs.randomChar()
    }
  }
  return id
}

/** 检查视图名称在table中是否存在 */
function checkViewNameIsExist(table: ITable, name: string): boolean {
  for (const viewId in table.views) {
    const view = table.views[viewId]
    if (view.name === name) {
      return true
    }
  }
  return false
}

/** 获取一个视图唯一标题 */
function generateViewName(table: ITable): string {
  let isUnique = false
  let index = table.viewsSorts.length + 1
  while (!isUnique) {
    if (!checkViewNameIsExist(table, `表格视图 ${index}`)) {
      isUnique = true
      break
    } else {
      index++
    }
  }
  return `表格视图 ${index}`
}

function addView(table: ITable) {
  const index = table.viewsSorts.length + 1

  const view: IView = {
    _id: generateViewId(table),
    type: 'table',
    name: generateViewName(table),
    description: '',
    fields: [],
    rowsSorts: [],
    filters: [],
  }
  //需要通过Vue给不存在的属性添加响应式
  Vue.set(table.views, view._id, view)
  table.viewsSorts.push(view._id)
}

function removeView(table: ITable, view: IView) {
  delete table.views[view._id]

  const index = table.viewsSorts.indexOf(view._id)
  if (index !== -1) {
    table.viewsSorts.splice(index, 1)
  }
}

const view = {
  addView,
  removeView,
  checkViewNameIsExist,
}

export default view