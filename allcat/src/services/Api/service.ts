import { IJSONRow } from '@/types/IJSONRow'
import { IApi } from './types'

export class ApiService implements IApi {
  addRow (data: { app: string; table: string; row: IJSONRow }): Promise<boolean> {

    // 字段名称 使用id 还是 使用具名
    // 字段名称 不存在是创建 还是 抛弃

    // 新增还是追加 

    console.log('addRow arguments', data)
    return Promise.resolve(true)
  }
}