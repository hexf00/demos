import { ISortRule } from '@/models/View/ViewSorter'
import { CreateElement, RenderContext } from 'vue'
import style from './index.module.scss'


type Props = {
  service: ISortRule
}

const SortItem = {
  props: {
    service: Object,
  },
  functional: true,
  render(h: CreateElement, { props, parent }: RenderContext<Props>) {
    const { service } = props
    return <div>

    </div>
  },
} as unknown as FunctionalComponent<Props>

export default SortItem