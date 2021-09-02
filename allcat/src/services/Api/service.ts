import { IJSONRow } from '@/types/IJSONRow'
import { IApi } from './types'

export class ApiService implements IApi {
  addRow (data: { app: string; table: string; row: IJSONRow }): Promise<boolean> {
    console.log('addRow arguments', data)
    return Promise.resolve(true)
  }
}