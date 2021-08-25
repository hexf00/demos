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
    on?: {
      enterEdit?: () => void
    }
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

  render (h: CreateElement) {
    if (this.isEdit) {
      return <el-input class={style.textarea} ref="input" size="mini" type="textarea" autosize v-model={this.localValue} on={{
        // 因为自动排序与失去焦点存在冲突，所以弃用失去焦点，改为手动判断点击是否处于当前行来判断焦点是否丢失
      }} nativeOn={{
        click: (e: Event) => {
          e.stopPropagation()
        },
        keyup: (e: KeyboardEvent) => {
          const { code } = e
          if (code === 'Escape') {
            this.isEdit = false
          } else if (code === 'Enter') {
            if (e.altKey || e.ctrlKey) {
              /** 增加空格 */
              this.localValue += '\n'
            } else {

              //中文输入法中输入英文需要按回车，但不应该触发回车事件
              const lastChar = this.localValue.slice(-1)
              if (lastChar !== '\n') {
                return
              }
              /** 删除空格 */
              this.localValue = this.localValue.slice(0, -1)

              // 保存
              this.submit()
              this.isEdit = false
            }
          }
        },
      }} />
    } else {
      return <div class={style.preview} on={{
        dblclick: () => {
          this.isEdit = true
        },
      }}>
        <el-tooltip
          placement="top"
          open-delay={350}
          popper-class={style.tip}>
          <div class={style.cell}>{this.value}</div>
          <div slot="content">{this.value}</div>
        </el-tooltip>
      </div>
    }
  }
}
