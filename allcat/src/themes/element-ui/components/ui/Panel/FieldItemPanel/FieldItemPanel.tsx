import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './index.module.scss'
import { Form, Input, Select } from 'element-ui'
import { IJSONTable } from '@/types/IJSONTable'
import { IJSONRow } from '@/types/IJSONRow'
import OptionList from './components/OptionList/OptionList'
import store from '@/store'

@Component
export default class FieldItemPanel extends Vue {
  $refs!: {
    form: Form
    name: Input
    typeSelect: Select
  }

  @Prop(Object) field!: any
  @Prop(Object) table!: IJSONTable

  mounted () {

  }

  @Watch('field', { immediate: true })
  onEdit (value: boolean) {
    if (this.field) {
      this.$nextTick(() => {
        this.$refs.name.select()
      })
    }
  }

  /** 表单校验 */
  async validate () {
    return new Promise((resolve) => {
      this.$refs.form.validate((valid) => {
        resolve(valid)
      })
    })
  }

  async submit () {
    if (!await this.validate()) {
      return
    }

    const { id: fieldId, type, isMulti } = this.field
    const oldField = this.table.fields[fieldId]
    const { type: OldType } = this.table.fields[fieldId]

    const oldIsMulti = (oldField.type === 'select' || oldField.type === 'relation') && oldField.isMulti

    // 无（文本）  单|多(选择、关联)
    // 多 -> 单 丢弃多余项
    // 单 -> 多 结构变数组
    // 无 -> 单 不变
    // 无 -> 多 逗号切割，增加选项
    // 多 -> 无 逗号合并
    // 单 -> 无 不变
    // 文本、选择 -> 关联 明文变id(不存在新增或丢弃)
    // 关联 -> 选择、文本 id变明文  
    // 关联类型 还会在 目标表 创建反向关联字段

    let convert
    //多->选 会丢失数据 需要提示用户
    if (oldIsMulti && !isMulti /** 多转单 */) {
      if (type === 'select' && OldType === 'select') {
        //丢失多选项
        convert = (row: IJSONRow) => {
          const oldVal = row[fieldId] as string[]
          const newVal = oldVal && oldVal.length > 0 ? oldVal[0] : ''
          row[fieldId] = newVal
        }
      } else {
        convert = (row: IJSONRow) => {
          const oldVal = row[fieldId] as string[]
          const newVal = oldVal.join(',')
          row[fieldId] = newVal
        }
      }
    } else if (!oldIsMulti && isMulti /** 单转多 */) {
      convert = (row: IJSONRow) => {
        const oldVal = row[fieldId] as string
        const newVal = oldVal !== '' ? oldVal.split(',')
          .map(it => it.trim())
          .filter(it => it !== '') : []
        row[fieldId] = newVal
      }
    }

    for (const key in this.table.rows) {
      const row = this.table.rows[key]
      convert && convert(row)
    }

    if (type !== 'select') {
      //说明 此处没有使用delete 是因为外部使用的是Object.assign
      this.field.selectOptions = undefined
      this.field.isMulti = undefined
    }

    this.$emit('submit', this.field)
  }

  /** 从现有的value提取选项，不涉及转换 */
  generateOptions () {
    const { id: fieldId } = this.field
    const oldField = this.table.fields[fieldId]
    const oldIsMulti = (oldField.type === 'select' || oldField.type === 'relation') && oldField.isMulti

    const optionsMap: Set<string> = new Set()

    const addOption = (row: IJSONRow) => {
      const val = row[fieldId] as string
      val !== undefined && val !== '' && val.split(',')
        .map(it => it.trim())
        .filter(it => it !== '')
        .forEach(it => optionsMap.add(it))
    }

    const addMultiOption = (row: IJSONRow) => {
      const val = row[fieldId] as string[]
      val.forEach(it => optionsMap.add(it))
    }

    for (const key in this.table.rows) {
      const row = this.table.rows[key]
      oldIsMulti ? addMultiOption(row) : addOption(row)
    }

    return Array.from(optionsMap).map(it => ({
      color: '',
      value: it,
    }))
  }

  changeType (type: string) {
    const field = this.field
    //保留哪些属性，对哪些属性赋初始值
    if (!['select', 'relation'].includes(type)) {
      delete field.isMulti
    } else {
      field.isMulti = !!field.isMulti
    }

    if (['select'].includes(type) && !field.selectOptions) {
      field.selectOptions = this.generateOptions()
    }

    this.$emit('update:field', JSON.parse(JSON.stringify(field)))
  }

  render (h: CreateElement) {
    const field = this.field
    if (!field) {
      return <div>加载中</div>
    }

    return <div class={style.panel}>
      <el-form ref="form" size="mini" label-position="left" label-width="80px" props={{ model: field }}>
        <el-form-item label="名称" prop="name">
          <el-input ref="name" vModel={field.name} nativeOn={{
            keyup: (e: KeyboardEvent) => e.key === 'Enter' && this.submit(),
          }}></el-input>
        </el-form-item>
        <el-form-item label="描述" label-position="top" prop="description">
          <el-input vModel={field.description}></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select ref="typeSelect" vModel={field.type} on={{
            input: (type: string) => this.changeType(type),
            // 下拉框显示
            'visible-change': (vis: boolean) => {
              if (vis) {
                this.$nextTick(() => {
                  const vNode = this.$refs['typeSelect'].$refs['popper'] as Vue
                  const el = vNode.$el as HTMLElement
                  el.style.zIndex = '10000'
                })
              }
            },
          }}>
            <el-option label="文本" value="text"></el-option>
            <el-option label="选项" value="select"></el-option>
            <el-option label="关联" value="relation"></el-option>
          </el-select>
        </el-form-item>
        {['select', 'relation'].includes(field.type) && <el-form-item label="启用多选" prop="multi">
          <el-switch vModel={field.isMulti}></el-switch>
        </el-form-item>}

        {
          field.type === 'relation' && <el-form-item label="引用表" prop="relationTo" required>
            <el-select ref="typeSelect" vModel={field.relationTo} on={{
              input: (type: string) => this.changeType(type),
              // 下拉框显示 hack
              'visible-change': (vis: boolean) => {
                if (vis) {
                  this.$nextTick(() => {
                    const vNode = this.$refs['typeSelect'].$refs['popper'] as Vue
                    const el = vNode.$el as HTMLElement
                    el.style.zIndex = '10000'
                  })
                }
              },
            }}>
              {
                store.currentApp?.tableSorts.map(it => {
                  const table = store.currentApp!.tables[it]
                  return <el-option label={table.name} value={table.id} key={table.id}></el-option>
                })}
            </el-select>
          </el-form-item>
        }

        {
          field.type === 'select' &&
          <OptionList field={field}></OptionList>
        }
        <el-form-item style="text-align: right;">
          <el-button on={{ click: () => { this.$emit('cancel') } }}>取消</el-button>
          <el-button type="primary" on={{ click: () => this.submit() }}>保存</el-button>
        </el-form-item>
      </el-form>
    </div >
  }
}
