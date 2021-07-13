import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './index.module.scss'
import { Form, Input, Select } from 'element-ui'
import { IJSONTable } from '@/types/IJSONTable'
import OptionList from './components/OptionList/OptionList'
import store from '@/store'
import { EFieldType } from '@/types/EType'
import { ConverterFactory } from '@/services/Converter/ConvertHelper'

@Component
export default class FieldItemPanel extends Vue {
  $refs!: {
    form: Form
    name: Input
    typeSelect: Select
    relationTo: Select
  }

  @Prop(Object) field!: any
  @Prop(Object) table!: IJSONTable

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

    const field = this.field
    if (field.type === EFieldType.select) {
      this.$set(field, 'isMulti', !!field.isMulti)
    } else if (field.type === EFieldType.relation) {
      this.$set(field, 'isMulti', !!field.isMulti)
      field.selectOptions = undefined
    } else {
      field.isMulti = undefined
      field.selectOptions = undefined
    }

    this.$emit('submit', this.field)
  }

  changeType () {
    const field = this.field

    // 由于有的数据不存在，需要解决不响应的问题
    // 1. $set方式
    // 2. this.$emit('update:field', JSON.parse(JSON.stringify(field)))
    // 3. 优化为getData

    if (field.type === EFieldType.select) {
      this.$set(field, 'isMulti', !!field.isMulti)
      // 获取选项
      this.$set(field, 'selectOptions', ConverterFactory(this.table.fields[field.id]).getSelectOptions(this.table, field))
    } else if (field.type === EFieldType.relation) {
      this.$set(field, 'isMulti', !!field.isMulti)
    }
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
            input: () => this.changeType(),
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
            <el-option label="文本" value={EFieldType.text}></el-option>
            <el-option label="数值" value={EFieldType.number}></el-option>
            <el-option label="选项" value={EFieldType.select}></el-option>
            <el-option label="关联" value={EFieldType.relation}></el-option>
          </el-select>
        </el-form-item>

        {['select', 'relation'].includes(field.type) && <el-form-item label="启用多选" prop="multi">
          <el-switch vModel={field.isMulti} oninput={() => this.changeType()}></el-switch>
        </el-form-item>}

        {field.type === 'relation' && <el-form-item label="引用表" prop="relationTo" required>
          <el-select ref="relationTo" vModel={field.relationTo} on={{
            // 下拉框显示 hack
            'visible-change': (vis: boolean) => {
              if (vis) {
                this.$nextTick(() => {
                  const vNode = this.$refs['relationTo'].$refs['popper'] as Vue
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
        </el-form-item>}

        {field.type === 'select' && <OptionList field={field}></OptionList>}

        <el-form-item style="text-align: right;">
          <el-button on={{ click: () => { this.$emit('cancel') } }}>取消</el-button>
          <el-button type="primary" on={{ click: () => this.submit() }}>保存</el-button>
        </el-form-item>
      </el-form>
    </div >
  }
}
