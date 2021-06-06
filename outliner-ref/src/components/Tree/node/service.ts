import { Service } from 'ioc-di'
import { iTreeNode } from '.'

@Service()
export default class ITreeNode implements iTreeNode {
  content = ''
  value = ''
  children: ITreeNode[] = []
  editable = false

  edit() {
    this.editable = true
  }

  blur() {
    this.updateContent()
    this.editable = false
  }

  parent?: this
  setParent(parent: this) {
    this.parent = parent
  }

  constructor({ value, children }: { value: string; children: ITreeNode[] }) {
    this.value = value
    this.children = children
    this.updateContent()
  }
  updateContent() {
    this.content = this.value
  }
}