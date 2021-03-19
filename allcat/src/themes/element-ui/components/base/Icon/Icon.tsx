import { Component, Vue, Prop } from 'vue-property-decorator'
import icons from './icons'

@Component
export default class Icon extends Vue {
  @Prop(String)
  name!: keyof typeof icons

  render(h: Vue.CreateElement) {
    const { name } = this
    return icons[name] ? icons[name](h) || <div></div> : <div></div>
  }
}
