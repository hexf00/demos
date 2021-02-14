import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'

@Component
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    return <div>TableView</div>
  }
}
