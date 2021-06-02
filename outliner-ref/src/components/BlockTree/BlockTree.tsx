import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import Block from '@/components/Block/Block'

@Component({
  name: 'BlockTree',
})
export default class extends Vue {
  @Prop(Array) data!: Tree<IBlock>

  render(h: CreateElement) {
    return <ul>
      {
        this.data.map(item => <Block data={item} key={item.id} on={{
          showEditMode: () => {
            console.log(item.value, '希望进入编辑模式')
          },
        }} />)
      }
    </ul>
  }
}
