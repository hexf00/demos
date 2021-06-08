import { findParent } from '@/libs/domHelper'
import { moveItem } from '@/libs/TreeHelper'
import { IBlock, IJsonBlock } from '@/types/block'
import { Already, Concat, GetContainer, Root, Service } from 'ioc-di'
import BlockService from './Block.service'

@Service()
export default class TreeService {

  data: ITreeItem<IBlock>[] = []
  treeService: ITreeItem<BlockService>[] = []

  /** block 运行时字典 */
  blockDict: Record<string, ITreeItem<IBlock>> = {}

  constructor() {
    this.init()
  }

  @Already
  init() {

    const blockData: ITreeItem<IJsonBlock>[] = [
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
      {
        id: '引用节点测试2',
        value: '![[南京]]',
        children: [],
      },
    ]

    this.blockDict = this.initBlockDict(blockData)
    // TODO:此处代码是为了给序列化数据转换为运行时数据，应该重构下
    this.data = blockData as ITreeItem<IBlock>[]
    this.treeService = this.initService(this.data)
  }

  initService(tree: ITreeItem<IBlock>[]): ITreeItem<BlockService>[] {
    return tree.map(it => Concat(this, new BlockService(it)))
  }

  /** 初始化Block运行时字典 */
  initBlockDict(tree: ITreeItem<IJsonBlock>[]): Record<string, ITreeItem<IBlock>> {
    const map = (dict: Record<string, IBlock>, it: ITreeItem<IJsonBlock>) => {
      dict[it.id] = Object.assign(it, { useRefs: [] })
      it.children.reduce(map, this.blockDict)
      return dict
    }

    tree.reduce(map, this.blockDict)

    return this.blockDict
  }

  move({ item, target, pos }: { item: ITreeItem<BlockService>; target: ITreeItem<BlockService>; pos: 'before' | 'after' | 'inner' }) {
    // 移动数据树 dom不更新
    moveItem({ item: item.data, target: target.data, rootDataList: this.data, pos })

    // TODO:如果操作的是引用树的节点，则先转化为真实树的节点

    //item如果移入引用  target/target.parent是新增 target.refParent/target.parent.refParent需要reCalc
    //item如果移出引用  item.parent是删除 item.refParent需要reCalc

    const oldRefParent = findParent({
      node: item,
      parentKey: 'parent',
      findCondition: (node) => node.data.useRefs.length > 0,
    })

    //item可能被移出引用 需要reCalc item.refParent
    oldRefParent?.data.useRefs.slice().forEach(it => {
      if (it.refParent) {
        it.refParent.refs = it.refParent.calcRefs()
      }
    })

    // 移动service树会漏掉引用
    moveItem({ item: item, target: target, rootDataList: this.treeService, pos })

    const newParent = (pos === 'before' || pos === 'after') ? target.parent : target
    if (newParent) {
      //找target最近存在引用节点的父级节点
      const newRefParent = findParent({
        node: newParent,
        parentKey: 'parent',
        findCondition: (node) => node.data.useRefs.length > 0,
      })

      //释放位置新增
      newRefParent?.data.useRefs.slice().forEach(it => {
        if (it.refParent) {
          it.refParent.refs = it.refParent.calcRefs()
        }
      })
    }

  }
}
