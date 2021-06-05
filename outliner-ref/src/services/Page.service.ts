import { IBlock } from '@/types/block'
import BlockService from './Block.service'

export default class PageService {

  treeService: ITreeItem<BlockService>[]

  blockDict: Record<string, ITreeItem<IBlock>> = {}

  constructor(public tree: ITreeItem<IBlock>[]) {
    this.blockDict = this.initBlockDict(tree)
    this.treeService = this.initService(tree)
  }

  initService(tree: ITreeItem<IBlock>[]): ITreeItem<BlockService>[] {
    return tree.map(it => new BlockService(it, this))
  }

  initBlockDict(tree: ITreeItem<IBlock>[]): Record<string, ITreeItem<IBlock>> {
    const map = (dict: Record<string, IBlock>, it: ITreeItem<IBlock>) => {
      dict[it.id] = it
      it.children.reduce(map, this.blockDict)
      return dict
    }

    tree.reduce(map, this.blockDict)

    return this.blockDict
  }

}
