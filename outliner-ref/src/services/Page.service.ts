import { IBlock } from '@/types/block'
import BlockService from './Block.service'

export default class PageService {

  treeService: TreeItem<BlockService>[]

  blockDict: Record<string, TreeItem<IBlock>> = {}

  constructor(public tree: TreeItem<IBlock>[]) {
    this.blockDict = this.initBlockDict(tree)
    this.treeService = this.initService(tree)
  }

  initService(tree: TreeItem<IBlock>[]): TreeItem<BlockService>[] {
    return tree.map(it => new BlockService(it, this))
  }

  initBlockDict(tree: TreeItem<IBlock>[]): Record<string, TreeItem<IBlock>> {
    const map = (dict: Record<string, IBlock>, it: TreeItem<IBlock>) => {
      dict[it.id] = it
      it.children.reduce(map, this.blockDict)
      return dict
    }

    tree.reduce(map, this.blockDict)

    return this.blockDict
  }

}
