import { Mixins, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { Select } from 'element-ui'
import BaseCell from '../BaseCell'
import SelectCellService from './service'
import style from './index.module.scss'

@Component
export default class SelectCell<T extends string | string[]> extends Mixins(BaseCell) {
  $refs!: {
    select: Select
  }

  $props!: {
    value: T
    service: SelectCellService
    oninput: (value: T) => void
  }

  @Prop() readonly value!: T
  localValue!: T

  @Prop(Object) readonly service!: SelectCellService

  @Watch('isEdit', { immediate: true })
  onEdit (isEdit: boolean) {
    if (isEdit === true) {

      this.initLocalValue(this.value)
      //需要nextTick否则触发时机存在问题
      this.$nextTick(() => {
        this.$refs.select.focus()
        const el = this.$refs.select.$el as HTMLElement
        el.click()
      })
    }
  }

  onBlur () {
    this.submit()
    this.isEdit = false
  }

  getColor (value: string) {
    const { selectOptions } = this.service
    return selectOptions?.find(option => option.value === value)?.color
  }

  render (h: CreateElement) {
    const { selectOptions } = this.service
    if (this.isEdit) {
      return <div class={style.select}>
        <el-select ref="select" v-model={this.localValue} size="mini"
          on={{
            clickoutside: () => {
              this.onBlur()
            },
          }}
          allow-create
          clearable
          props={{
            multiple: this.service.isMulti,
            /** 单选情况下第一次需要多按一次方向键，element-ui bug */
            'filterable': true,
            /** 添加后按enter才能自动创建选项，但是单选情况存在bug */
            'default-first-option': true,
          }}
          nativeOn={{
            click: (e: Event) => {
              // e.stopPropagation()
            },
            keyup: (e: KeyboardEvent) => {
              // const { code } = e
              // if (code === 'Escape') {
              //   this.isEdit = false
              // } else if (code === 'Enter') {
              //   // 保存
              //   if (field.isMulti) {
              //     //多选不关闭选框
              //   } else {
              //     this.submit()
              //     this.isEdit = false
              //   }
              // }
            },
          }}>
          {selectOptions.map(item => <el-option
            key={item.value}
            label={item.label}
            value={item.value}>
            <el-tag size="mini"
              style={{ 'background-color': item.color, color: '#000' }}>
              {item.label}
            </el-tag>
          </el-option>)}
        </el-select>
      </div >
    } else {
      return <div class={style.preview} on={{
        dblclick: () => {
          this.isEdit = true
        },
      }}>
        {this.value !== undefined && (this.service.isMulti
          ? (this.value as string[]).map(item =>
            <el-tag size="mini" style={{ 'background-color': this.getColor(item), color: '#000' }}>
              {this.service.toText(item)}
            </el-tag>)
          : this.value && <el-tag size="mini" style={{ 'background-color': this.getColor(this.value as string), color: '#000' }}>
            {this.service.toText(this.value as string)}
          </el-tag>)}
      </div>
    }
  }
}
