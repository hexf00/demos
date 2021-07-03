import { Mixins, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { Input } from 'element-ui'
import BaseCell from '../BaseCell'
import TextCellService from './service'
import style from './index.module.scss'

@Component
export default class TextCell extends Mixins(BaseCell) {
  $refs!: {
    input: Input
  }

  $props!: {
    value: string
    service: TextCellService
    oninput: (value: string) => void
  }

  @Prop() readonly value!: string
  localValue!: string

  @Prop(Object) readonly service!: TextCellService

  @Watch('isEdit', { immediate: true })
  onEdit (isEdit: boolean) {
    if (isEdit === true) {
      this.initLocalValue(this.value)
      //需要nextTick否则触发时机存在问题
      this.$nextTick(() => {
        this.$refs.input.select()
      })
    }
  }

  onBlur () {
    this.submit()
    this.isEdit = false
  }

  render (h: CreateElement) {
    if (this.isEdit) {
      return <el-input ref="input" size="mini" type="text" v-model={this.localValue} on={{
        blur: () => this.onBlur(),
      }} nativeOn={{
        click: (e: Event) => {
          e.stopPropagation()
        },
        keyup: (e: KeyboardEvent) => {
          const { code } = e
          if (code === 'Escape') {
            this.isEdit = false
          } else if (code === 'Enter') {
            // 保存
            this.submit()
            this.isEdit = false
          }
        },
      }} />
    } else {
      return <div class={style.preview} on={{
        dblclick: () => {
          this.isEdit = true
        },
      }}>
        <el-popover
          placement="bottom-start"
          width="280"
          trigger="click">
          <div>{this.value}</div>
          <div class={style.cell} slot="reference">{this.value}</div>
        </el-popover>
      </div>
    }
  }
}
