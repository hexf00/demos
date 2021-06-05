import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'

@Component
export default class BlockTree extends Vue {

  render(h: CreateElement) {
    return <ul>
      {this.$slots.default}
    </ul>
  }
}
