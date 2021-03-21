import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IJSONTableField } from '@/models/Table/TableField'
import style from './index.module.scss'
import { Input } from 'element-ui'
import { IJSONTable } from '@/models/Table/Table'
import { IJSONRow } from '@/models/Table/Row'


@Component
export default class FieldItemPanel extends Vue {
  $refs!: {
    name: Input
  }

  @Prop(Object) field!: IJSONTableField
  @Prop(Object) table!: IJSONTable

  mounted() {

  }

  @Watch('field', { immediate: true })
  onEdit(value: boolean) {
    if (this.field) {
      this.$nextTick(() => {
        this.$refs.name.select()
      })
    }
  }

  submit() {
    const { id: fieldId, type, isMulti, selectOptions } = this.field
    const { isMulti: oldIsMulti } = this.table.fields[fieldId]


    // 文本 -> 关联、 关联 -> 文本
    // 多 -> 单、 单 -> 多

    if (type === 'select') {

      let convert
      //多->选 会丢失数据 需要提示用户
      if (oldIsMulti && !isMulti) {
        convert = (row: IJSONRow) => {
          const oldVal = row[fieldId] as string[]
          const newVal = oldVal && oldVal.length > 0 ? oldVal[0] : ''
          row[fieldId] = newVal
        }
      } else if (!oldIsMulti && isMulti) {
        convert = (row: IJSONRow) => {
          const oldVal = row[fieldId] as string
          const newVal = oldVal !== '' ? [oldVal] : []
          row[fieldId] = newVal
        }
      }

      const options: Set<string> = new Set()
      let addOptions
      if (!selectOptions/** 需要初始化 */) {
        addOptions = (row: IJSONRow) => {
          if (!selectOptions) {
            if (isMulti) {
              const val = row[fieldId] as string[]
              val.forEach(it => options.add(it))
            } else {
              const val = row[fieldId] as string
              val !== '' && options.add(val)
            }
          }
        }
      }

      for (const key in this.table.rows) {
        const row = this.table.rows[key]
        convert && convert(row)
        addOptions && addOptions(row)
      }

      if (addOptions) {
        //赋初始值
        this.field.selectOptions = Array.from(options).map(it => ({
          color: '',
          value: it,
        }))
      }
    } else {
      //说明 此处没有使用delete 是因为外部使用的是Object.assign
      this.field.selectOptions = undefined
    }

    this.$emit('submit', this.field)
  }

  render(h: CreateElement) {
    if (!this.field) {
      return <div>加载中</div>
    }

    return <div class={style.panel}>
      <el-form size="mini" label-position="top" label-width="80px" props={{ model: this.field }}>
        <el-form-item label="名称" prop="name">
          <el-input ref="name" vModel={this.field.name} nativeOn={{
            keyup: (e: KeyboardEvent) => e.key === 'Enter' && this.submit(),
          }}></el-input>
        </el-form-item>
        <el-form-item label="描述" label-position="top" prop="description">
          <el-input vModel={this.field.description}></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select vModel={this.field.type} on={{
            input: (val: string) => {
              if (!['select', 'relation'].includes(val)) {
                this.field.isMulti = false
              }
            },
          }}>
            <el-option label="文本" value="text"></el-option>
            <el-option label="选项" value="select"></el-option>
            <el-option label="关联" value="relation"></el-option>
          </el-select>
        </el-form-item>
        {['select', 'relation'].includes(this.field.type) && <el-form-item label="启用多选" prop="multi">
          <el-switch vModel={this.field.isMulti}></el-switch>
        </el-form-item>}
        <el-form-item style="text-align: right;">
          <el-button on={{ click: () => { this.$emit('cancel') } }}>取消</el-button>
          <el-button type="primary" on={{ click: () => this.submit() }}>保存</el-button>
        </el-form-item>
      </el-form>
    </div >
  }
}
