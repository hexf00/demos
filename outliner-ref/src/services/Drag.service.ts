import { IDragInfo } from '@/types/dragInfo'
import { Already, Concat, GetContainer, Inject, Root, Service } from 'ioc-di'
import BlockService from './Block.service'
import TreeService from './Tree.service'

@Service()
export default class DragService {
  @Inject() tree!: TreeService

  dragInfo: IDragInfo<BlockService> = {
    status: false,
    item: undefined,
    target: undefined,
    pos: undefined,
  }

  resetDragInfo() {
    this.dragInfo = {
      status: false,
      item: undefined,
      target: undefined,
      pos: undefined,
    }
  }

  /** 执行拖拽 */
  drag() {
    const { status, item, target, pos } = this.dragInfo
    this.resetDragInfo()
    if (status && item && target && pos) {
      this.tree.move({ item, target, pos })
    }
  }
}
