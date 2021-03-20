import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IJSONTableField } from '@/models/Table/TableField'
import style from './index.module.scss'
import { Input } from 'element-ui'


@Component
export default class FieldItemPanel extends Vue {
  $refs!: {
    name: Input
  }

  @Prop(Object) field!: IJSONTableField

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
