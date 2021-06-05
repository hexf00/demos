import { IBlock } from '@/types/block'
import { IBlockEditorService } from '@/components/BlockEditor/BlockEditor'
import { IBlockViewerService } from '@/components/BlockViewer/BlockViewer'
import { IBlockService } from '@/components/Block/Block'
import PageService from './Page.service'
export default class BlockService implements IBlockService {

  isEdit = false

  children: BlockService[]

  /** 需要显示引用的数据 */
  refs: BlockService[]

  constructor(public data: ITreeItem<IBlock>, public pageService: PageService) {
    this.children = data.children.map(it => new BlockService(it, pageService))
    this.refs = this.calcRefs()
  }

  /** 计算引用的块 */
  calcRefs(): BlockService[] {
    const match = this.data.value.matchAll(/!\[\[([\u4e00-\u9fa5a-zA-Z0-9]+?)\]\]/g)

    const ids: string[] = []
    let r
    for (r = match.next(); !r.done; r = match.next()) {
      const id = r.value[1]

      this.pageService.blockDict[id] && ids.push(id)
    }

    return ids.map(it => new BlockService(this.pageService.blockDict[it], this.pageService))
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

}
