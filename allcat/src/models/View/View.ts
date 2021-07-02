import { IJSONViewField } from './ViewField'
import { IViewFilter } from './ViewFilter'
import { IJSONTable } from '../../types/IJSONTable'
import libs from '@/libs'
import Vue from 'vue'
import store from '@/store'
import { IViewSorter } from './ViewSorter'

export interface IView {
  /** 视图主键 */
  id: string
  /** 视图类型 */
  type: 'table' | 'kanban'
  /** 视图名称 */
  name: string
  /** 视图描述 */
  description: string
  /** 视图字段配置 */
  fields: IJSONViewField[]
  /** 视图数据排序 */
  rowsSorts: string[]
  /** 过滤器 */
  filters: IViewFilter[]
  /** 排序器 */
  sort: IViewSorter
}

/**
 * 获取一个视图唯一id
 */
function generateViewId (table: IJSONTable): string {
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
function checkViewNameIsExist (table: IJSONTable, name: string): boolean {
  for (const viewId in table.views) {
    const view = table.views[viewId]
    if (view.name === name) {
      return true
    }
  }
  return false
}

/** 获取一个视图唯一标题 */
function generateViewName (table: IJSONTable): string {
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

function addView (table: IJSONTable) {

  //说明： 此处如果已经选择了一个视图，则基于当前视图复制，如果未选择，使用一个视图的配置复制。 上述复制均不含筛选条件、分组等。

  let baseView = store.currentView

  if (!baseView || !table.views[baseView.id]) {
    baseView = table.views[table.viewsSorts[0]]
  }

  const view: IView = {
    id: generateViewId(table),
    type: 'table',
    name: generateViewName(table),
    description: '',
    fields: baseView ? JSON.parse(JSON.stringify(baseView.fields)) : [],
    rowsSorts: baseView ? [...baseView.rowsSorts] : [],
    filters: [],
    sort: { isAutoSort: false, rules: [] },
  }
  //需要通过Vue给不存在的属性添加响应式
  Vue.set(table.views, view.id, view)
  table.viewsSorts.push(view.id)
}

function removeView (table: IJSONTable, view: IView) {
  delete table.views[view.id]

  const index = table.viewsSorts.indexOf(view.id)
  if (index !== -1) {
    table.viewsSorts.splice(index, 1)
  }
}

const JsonView = {
  addView,
  removeView,
  checkViewNameIsExist,
}

export default JsonView