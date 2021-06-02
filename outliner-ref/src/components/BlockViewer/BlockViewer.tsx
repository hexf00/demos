import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'

@Component({
  name: 'BlockViewer',
})
export default class extends Vue {
  @Prop(Object) data!: TreeItem<IBlock>

  render(h: CreateElement) {
    return <div>
      {this.data.value}
    </div>
  }
}
