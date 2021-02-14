import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import ViewMenuItem from './components/TableItem/TableItem'

@Component
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    return <div>
      <ViewMenuItem></ViewMenuItem>
      <ViewMenuItem></ViewMenuItem>
    </div>
  }
}
