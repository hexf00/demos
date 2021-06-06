import { IBlock } from '@/types/block'
import { IBlockService } from '@/components/Block/Block'
import { Already, Concat, Inject, InjectRef, Service } from 'ioc-di'
import TreeService from './Tree.service'
import DragService from './Drag.service'
@Service()
export default class BlockService implements IBlockService {
  @InjectRef(() => DragService) drag!: DragService<IBlockService>
  @InjectRef(() => TreeService) tree!: TreeService

  isEdit = false

  children: BlockService[] = []

  /** 需要显示引用的数据 */
  refs: BlockService[] = []

  constructor(public data: ITreeItem<IBlock>, public parent?: ITreeItem<BlockService>) {
    this.init()
  }

  @Already
  init() {
    this.children = this.data.children.map(it => {
      it.parent = this.data
      return Concat(this, new BlockService(it, this))
    })
    this.refs = this.calcRefs()
  }

  /** 计算引用的块 */
  calcRefs(): BlockService[] {
    const match = this.data.value.matchAll(/!\[\[([\u4e00-\u9fa5a-zA-Z0-9]+?)\]\]/g)

    const ids: string[] = []
    let r
    for (r = match.next(); !r.done; r = match.next()) {
      const id = r.value[1]

      this.tree.blockDict[id] && ids.push(id)
    }

    return ids.map(it => Concat(this, new BlockService(this.tree.blockDict[it], this)))
  }

  showEdit() {
    this.isEdit = true
  }

  /**
     * 退出编辑模式
     * 如果用户修改了数据，需要刷新引用的块
     */
  hideEdit() {
    this.isEdit = false
    this.refs = this.calcRefs()
  }

  getDragInfo() {
    return this.drag.dragInfo
  }

}
