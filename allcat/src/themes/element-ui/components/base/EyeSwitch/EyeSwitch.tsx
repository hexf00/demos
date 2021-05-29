import { Component, Vue, Prop } from 'vue-property-decorator'
import Icon from '@/themes/element-ui/components/base/Icon/Icon'

@Component
export default class EyeSwitch extends Vue {
  @Prop(Boolean)
  value!: boolean

  render(h: Vue.CreateElement) {
    const { value } = this

    return <el-button type="text" size="mini" on={{
      click: () => {
        this.$emit('input', !value)
      },
    }}>
      {value
        ? <Icon value="eye"></Icon>
        : <Icon value="eyeClosed"></Icon>
      }
    </el-button>

  }
}
