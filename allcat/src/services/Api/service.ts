import { IJSONRow } from '@/types/IJSONRow'
import { IApi } from './types'

export class ApiService implements IApi {
  addRow (app: string, table: string, row: IJSONRow): Promise<boolean> {

    console.log('addRow')

    return Promise.resolve(true)
  }
}