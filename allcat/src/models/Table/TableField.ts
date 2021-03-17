import libs from '@/libs'
import { IJSONApp } from '../App/App'
import { IControl } from '../Control/Control'
import { IJSONTable } from './Table'
import Vue from 'vue'
export interface IJSONTableField {
  /** 字段主键 */
  _id: string
  /** 字段名称 */
  name: string
  /** 字段描述 */
  description: string
  /** 字段数据类型 */
  type: 'text' | 'number' | 'select' | 'script'
  // /** 字段控件配置 */
  // control: IControl
}



/** 获取一个字段唯一id */
function generateFieldId(table: IJSONTable): string {
  let isUnique = false
  let id = libs.randomChar()
  while (!isUnique) {
    if (!table.fields[id]) {
      isUnique = true
      break
    } else {
      id = libs.randomChar()
    }
  }
  return id
}

/** 检查字段名称在table中是否存在 */
function checkFieldNameIsExist(table: IJSONTable, name: string): boolean {
  for (const fieldId in table.fields) {
    const field = table.fields[fieldId]
    if (field.name === name) {
      return true
    }
  }
  return false
}

/** 返回一个table中未被使用的字段名称 */
function generateFieldName(table: IJSONTable): string {
  let isUnique = false
  let index = 1
  while (!isUnique) {
    if (!checkFieldNameIsExist(table, `未命名 ${index}`)) {
      isUnique = true
      break
    } else {
      index++
    }
  }
  return `未命名 ${index}`
}

/** 删除字段 */
function removeField(table: IJSONTable, field: IJSONTableField) {
  delete table.fields[field._id]

  for (const viewId in table.views) {
    const view = table.views[viewId]
    const index = view.fields.findIndex(it => it._id === field._id)
    if (index !== -1) {
      view.fields.splice(index, 1)
    }
  }
}

function addField(table: IJSONTable) {
  const field: IJSONTableField = {
    _id: generateFieldId(table),
    name: generateFieldName(table),
    description: '',
    type: 'text',
  }

  //需要通过Vue给不存在的属性添加响应式
  Vue.set(table.fields, field._id, field)

  for (const viewId in table.views) {
    const view = table.views[viewId]
    view.fields.push({ _id: field._id, isShow: true })
  }
}

const JsonField = {
  addField,
  removeField,
  checkFieldNameIsExist,
}

export default JsonField