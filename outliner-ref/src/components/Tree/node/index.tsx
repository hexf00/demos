import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue/types/umd'
import style from './style.module.scss'

export interface iTreeNode {
  content: string
  children: iTreeNode[]
  value: string

  editable: boolean

  edit(): void
  blur(): void
}

@Component
export default class TreeNode extends Vue {
  $props!: {
    service: iTreeNode
  }
  @Prop() service!: iTreeNode
  render(h: CreateElement) {
    const { content, editable } = this.service
    return <div class={style.node}>
      <div domProps={{
        innerHTML: content,
      }} ></div>
      <div class={style.children}>
        {this.service.children.map(node => <TreeNode service={node}></TreeNode>)}
      </div>
    </div>
  }
}