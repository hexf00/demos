import { Component, Vue, Prop } from 'vue-property-decorator'
import icons from './icons'

@Component
export default class Icon extends Vue {
  @Prop(String)
  value!: keyof typeof icons

  render(h: Vue.CreateElement) {
    const { value: name } = this
    return icons[name] ? icons[name](h) || <span></span> : <span></span>
  }
}
