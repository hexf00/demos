
/** 拖拽信息 */
export type IDragInfo<T> = {
  status: boolean
  item: ITreeItem<T> | undefined
  target: ITreeItem<T> | undefined
  pos: 'before' | 'after' | 'inner' | undefined
}