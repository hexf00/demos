import { IDragInfo } from '@/types/dragInfo'
import { Already, Concat, GetContainer, Root, Service } from 'ioc-di'

@Service()
export default class DragService<T> {
  dragInfo: IDragInfo<T> = {
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

  //执行拖拽
  drag() {
    const { status, item, target, pos } = this.dragInfo
    if (status && item && target && pos) {
      console.log('执行拖拽', this.dragInfo)
    }
  }
}
