import { ISelectOption } from '@/models/Table/fieldHelper'
import { IOptionAction } from '@/types/IOptionAction'

/** 选项管理类 */
export default class SelectManager {

  options: ISelectOption[] = []

  constructor() {

  }

  /** 通过对比新老option的 label 和 value  分析改动 */
  static diff (oldOptions: ISelectOption[], newOptions: ISelectOption[]) {
    return oldOptions.reduce((actions: Record<string, IOptionAction>, oldOption) => {
      const sameOption = newOptions.find(it => it.value === oldOption.value)
      if (sameOption) {
        if (sameOption.label !== oldOption.label) {
          // 改了名称
          actions[oldOption.value] = {
            type: 'edit',
            value: oldOption.value,
            newValue: sameOption.label,
          }
        }
      } else {
        // 删除了 
        if (!newOptions.find(it => it.label === oldOption.label)) {
          // 彻底删除了
          actions[oldOption.value] = {
            type: 'delete',
            value: oldOption.value,
          }
        }
      }
      return actions
    }, {})
  }

  setOptions (options: ISelectOption[]) {

    this.options = options
  }

  addOption () {
    const option: ISelectOption = {
      color: '',
      label: '',
      value: '',
    }
    this.options.push(option)
  }

  removeOption (option: ISelectOption) {
    const index = this.options.indexOf(option)
    if (index !== -1) {
      this.options.splice(index, 1)
    }
  }
}