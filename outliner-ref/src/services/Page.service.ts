import { IBlock } from '@/types/block'
import BlockService from './Block.service'

export default class PageService {

  treeService: Tree<BlockService>

  constructor(public tree: Tree<IBlock>) {
    this.treeService = this.initService(tree)
  }

  initService(tree: Tree<IBlock>): Tree<BlockService> {
    return tree.map(it => new BlockService(it))
  }

}
