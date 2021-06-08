import { IBlock } from '@/types/block'
import { IBlockService } from '@/components/Block/Block'
import { Already, Concat, Inject, InjectRef, Service } from 'ioc-di'
import TreeService from './Tree.service'
import DragService from './Drag.service'
@Service()
export default class BlockService implements IBlockService {
  @InjectRef(() => DragService) drag!: DragService
  @InjectRef(() => TreeService) tree!: TreeService

  isEdit = false

  children: BlockService[] = []

  /** 引用了哪些数据需要展示 */
  refs: BlockService[] = []

  /** ref父节点 */
  refParent?: BlockService

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
    // 解除已有的引用关系，避免无效引用
    // 注意：外部循环使用请先做浅拷贝
    this.refs.forEach(it => {
      const index = it.data.useRefs.indexOf(it)
      index !== -1 && it.data.useRefs.splice(index, 1)
    })

    const match = this.data.value.matchAll(/!\[\[([\u4e00-\u9fa5a-zA-Z0-9]+?)\]\]/g)

    const ids: string[] = []
    let r
    for (r = match.next(); !r.done; r = match.next()) {
      const id = r.value[1]

      this.tree.blockDict[id] && ids.push(id)
    }

    return ids.map(id => {
      const blockService = Concat(this, new BlockService(this.tree.blockDict[id], this))
      blockService.refParent = this
      this.tree.blockDict[id].useRefs.push(blockService)
      return blockService
    })
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
