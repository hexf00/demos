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
