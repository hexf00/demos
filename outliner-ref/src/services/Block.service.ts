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

  constructor(public data: TreeItem<IBlock>, public pageService: PageService) {
    this.children = data.children.map(it => new BlockService(it, pageService))
    const match = data.value.matchAll(/!\[\[([\u4e00-\u9fa5a-zA-Z0-9]+?)\]\]/g)

    const ids: string[] = []
    let r
    for (r = match.next(); !r.done; r = match.next()) {
      const id = r.value[1]

      pageService.blockDict[id] && ids.push(id)
    }

    this.refs = ids.map(it => new BlockService(pageService.blockDict[it], pageService))

  }

  showEdit() {
    this.isEdit = true
  }

  hideEdit() {
    this.isEdit = false
  }

}
