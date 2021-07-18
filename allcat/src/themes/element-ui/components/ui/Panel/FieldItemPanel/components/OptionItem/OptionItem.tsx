import { CreateElement, RenderContext } from 'vue'
import { ISelectOption } from '@/models/Table/fieldHelper'
import style from './index.module.scss'
import Icon from '@/themes/element-ui/components/base/Icon/Icon'
import ColorPicker from '../ColorPicker/ColorPicker'

type Props = {
  data: ISelectOption
  onRemove?: (item: ISelectOption) => void
}
const OptionsItem = {
  functional: true,
  props: {
    data: Object,
    onRemove: Function,
  },
  render (h: CreateElement, { props, parent }: RenderContext<Props>) {
    const { data, onRemove: onRemove } = props
    return <div class={style.item} >
      <Icon value="dragHandler" style="cursor: move;"></Icon>
      <ColorPicker value={data.color} oninput={(val: string) => { data.color = val }} />
      <el-input size="mini" value={data.label} oninput={(val: string) => {
        data.label = val
      }} ></el-input>
      <i class="el-icon-close" on={{
        click: () => onRemove && onRemove(data),
      }}></i>
    </div >
  },
} as unknown as FunctionalComponent<Props>

export default OptionsItem