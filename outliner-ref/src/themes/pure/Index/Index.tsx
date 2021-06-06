import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import BlockTree from '@/components/BlockTree/BlockTree'
import Block from '@/components/Block/Block'
import PageService from '@/services/Page.service'

@Component
export default class Index extends Vue {

  service = new PageService

  render(h: CreateElement) {
    const tree = this.service.tree
    return <div>
      <BlockTree service={tree}>
        {tree.treeService.map(item => <Block service={item}></Block>)}
      </BlockTree>
      <pre>
        {JSON.stringify(tree.data, null, 2)}
      </pre>
    </div>
  }
}
