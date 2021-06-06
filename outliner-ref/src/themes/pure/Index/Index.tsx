import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import BlockTree from '@/components/BlockTree/BlockTree'
import Block from '@/components/Block/Block'
import PageService from '@/services/Page.service'

@Component
export default class Index extends Vue {

  service = new PageService

  dragend(e: DragEvent) {
    const drag = this.service.drag
    drag.drag()
    drag.resetDragInfo()
  }

  render(h: CreateElement) {
    const tree = this.service.tree
    return <div on={{
      dragend: this.dragend,
    }}>
      <BlockTree>
        {tree.treeService.map(item => <Block service={item}></Block>)}
      </BlockTree>

      <pre>
        {this.service.drag.dragInfo.item?.data.id}
        {this.service.drag.dragInfo.target?.data.id}
        {this.service.drag.dragInfo.pos}
      </pre>
      <pre>
        {JSON.stringify(tree.data, null, 2)}
      </pre>

    </div>
  }
}
