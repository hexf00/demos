import { CreateElement, RenderContext } from 'vue'
import { TSelectOption } from '@/models/Table/TableField'
import style from './index.module.scss'
import Icon from '@/themes/element-ui/components/base/Icon/Icon'
import ColorPicker from '../ColorPicker/ColorPicker'

type Props = {
  data: TSelectOption
  onRemove?: (item: TSelectOption) => void
}
const OptionsItem = {
  props: {
    data: Object,
    onRemove: Function,
  },
  functional: true,
  render(h: CreateElement, { props, parent }: RenderContext<Props>) {
    const { data, onRemove: onRemove } = props
    return <div class={style.item} >
      <Icon value="dragHandler" style="cursor: move;"></Icon>
      <ColorPicker vModel={data.color} />
      <el-input size="mini" vModel={data.value} ></el-input>
      <i class="el-icon-close" on={{
        click: () => onRemove && onRemove(data),
      }}></i>
    </div >
  },
} as unknown as FunctionalComponent<Props>

export default OptionsItem