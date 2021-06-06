import { IBlockService } from '@/components/Block/Block'

/** Block数据层 定义 用于序列化 */
export interface IJsonBlock {
  id: string
  value: string
}

/** Block数据运行时 定义 */
export interface IBlock extends IJsonBlock {
  /** 哪些节点访问了数据，理论上应该与refs互相对应 */
  useRefs: IBlockService[]
}