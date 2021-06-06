/** 检查 item 是否为 parent 或其祖先 */
export function isParent<T>(item: ITreeItem<T>, parent: ITreeItem<T>): boolean {
  let currParent: ITreeItem<T> | undefined = item
  while (currParent) {
    if (currParent === parent) {
      return true
    } else {
      currParent = currParent.parent
    }
  }
  return false
}

/** 移动节点 */
export function moveItem<T>({ item, target, pos, rootDataList }: { item: ITreeItem<T>; target: ITreeItem<T>; pos: 'before' | 'after' | 'inner'; rootDataList: ITreeItem<T>[] }) {
  //在旧位置删除
  const itemParent = item.parent?.children || rootDataList
  const itemIndex = itemParent.indexOf(item)
  itemIndex !== -1 && itemParent.splice(itemIndex, 1)

  //在新位置插入
  if (pos === 'before' || pos === 'after') {
    item.parent = target.parent
    const parentList = item.parent?.children || rootDataList
    const targetIndex = parentList.indexOf(target)

    parentList.splice(pos === 'before' ? targetIndex : targetIndex + 1, 0, item)
  } else {
    item.parent = target
    item.parent.children.push(item)
  }
}