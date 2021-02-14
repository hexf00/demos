import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'

@Component
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    return <div>
      <div>Table</div>
      <div> - View</div>
    </div>
  }
}
