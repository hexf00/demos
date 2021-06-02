import { IBlock } from '@/types/block'
import { IBlockEditorService } from '@/components/BlockEditor/BlockEditor'
import { IBlockViewerService } from '@/components/BlockViewer/BlockViewer'
import { IBlockService } from '@/components/Block/Block'
export default class BlockService implements IBlockService {

  isEdit = false

  children: BlockService[]

  constructor(public data: TreeItem<IBlock>) {
    this.children = data.children.map(it => new BlockService(it))
  }

  showEdit() {
    this.isEdit = true
  }

  hideEdit() {
    this.isEdit = false
  }

}
