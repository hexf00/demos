import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'

@Component
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    const a = {
      a: 1,
      b: 1,
    }

    return <div>Element UI Index</div>
  }
}
