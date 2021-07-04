import libs from '@/libs'
import { IJSONTable } from '@/types/IJSONTable'
import Vue from 'vue'
import { IJSONTableField } from '@/types/IJSONTableField'
import { EFieldType } from '@/types/EFieldType'

export type TSelectOption = {
  /** 选项颜色 */
  color: string
  /** 选项值 */
  value: string
  /** 选项文字 */
  label: string
}

/** 获取一个字段唯一id */
function generateFieldId (table: IJSONTable): string {
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
function checkFieldNameIsExist (table: IJSONTable, name: string): boolean {
  for (const fieldId in table.fields) {
    const field = table.fields[fieldId]
    if (field.name === name) {
      return true
    }
  }
  return false
}

/** 返回一个table中未被使用的字段名称 */
function generateFieldName (table: IJSONTable): string {
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
function removeField (table: IJSONTable, field: IJSONTableField) {
  delete table.fields[field.id]

  for (const viewId in table.views) {
    const view = table.views[viewId]
    const index = view.fields.findIndex(it => it.id === field.id)
    if (index !== -1) {
      view.fields.splice(index, 1)
    }
  }
}

function addField (table: IJSONTable, fieldDefault: Partial<IJSONTableField> = {}): IJSONTableField {
  const field: IJSONTableField = {
    id: generateFieldId(table),
    name: fieldDefault.name || generateFieldName(table),
    description: '',
    type: EFieldType.text,
  }

  //需要通过Vue给不存在的属性添加响应式
  Vue.set(table.fields, field.id, field)

  for (const viewId in table.views) {
    const view = table.views[viewId]
    view.fields.push({ id: field.id, isShow: true })
  }

  return field
}

const fieldHelper = {
  addField,
  removeField,
  checkFieldNameIsExist,
}

export default fieldHelper