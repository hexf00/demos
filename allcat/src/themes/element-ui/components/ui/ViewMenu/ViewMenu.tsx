import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import ViewMenuItem from './components/ViewMenuItem/ViewMenuItem'

@Component
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    return <ViewMenuItem></ViewMenuItem>
  }
}
