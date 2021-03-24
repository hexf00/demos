import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { TSelectOption } from '@/models/Table/TableField'
import style from './index.module.scss'
import Icon from '@/themes/element-ui/components/base/Icon/Icon'
import ColorPicker from '../ColorPicker/ColorPicker'


@Component
export default class OptionItem extends Vue {

  @Prop(Object) data!: TSelectOption

  render(h: CreateElement) {
    const data = this.data
    return <div class={style.item}>
      <Icon value="dragHandler" style="cursor: move;"></Icon>
      <ColorPicker vModel={data.color} />
      <el-input size="mini" vModel={data.value}></el-input>
      <i class="el-icon-close"></i>
    </div >
  }
}
