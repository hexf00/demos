import { moveItem } from '@/libs/TreeHelper'
import { IBlock } from '@/types/block'
import { Already, Concat, GetContainer, Root, Service } from 'ioc-di'
import BlockService from './Block.service'

@Service()
export default class TreeService {

  data: ITreeItem<IBlock>[] = [
    {
      id: '上海',
      value: '上海',
      children: [],
    },
    {
      id: '江苏',
      value: '江苏',
      children: [
        {
          id: '南京',
          value: '南京',
          children: [{
            id: '秦淮', value: '秦淮', children: [],
          }, {
            id: '雨花台', value: '雨花台', children: [],
          }],
        },
        {
          id: '苏州',
          value: '苏州',
          children: [],
        },
      ],
    },
    {
      id: '引用节点测试',
      value: '![[南京]]',
      children: [],
    },
  ]

  treeService: ITreeItem<BlockService>[] = []

  blockDict: Record<string, ITreeItem<IBlock>> = {}

  constructor() {

    this.init()

  }

  @Already
  init() {
    this.blockDict = this.initBlockDict(this.data)
    this.treeService = this.initService(this.data)
  }

  initService(tree: ITreeItem<IBlock>[]): ITreeItem<BlockService>[] {
    return tree.map(it => Concat(this, new BlockService(it)))
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

  move({ item, target, pos }: { item: ITreeItem<BlockService>; target: ITreeItem<BlockService>; pos: 'before' | 'after' | 'inner' }) {
    // 移动数据树 dom不更新
    moveItem({ item: item.data, target: target.data, rootDataList: this.data, pos })
    // 移动service树会漏掉引用
    // moveItem({ item: item, target: target, rootDataList: this.treeService, pos })
  }
}
