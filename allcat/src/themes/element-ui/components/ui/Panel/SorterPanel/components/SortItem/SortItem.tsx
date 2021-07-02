import { ISortRule } from '@/models/View/ViewSorter'
import { CreateElement, RenderContext } from 'vue'

type Props = {
  service: ISortRule
}

const SortItem = {
  props: {
    service: Object,
  },
  functional: true,
  render (h: CreateElement, ctx: RenderContext<Props>) {
    return <div>

    </div>
  },
} as unknown as FunctionalComponent<Props>

export default SortItem