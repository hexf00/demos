import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IJSONTableField } from '@/models/Table/TableField'
import style from './index.module.scss'

@Component
export default class FieldItemPanel extends Vue {
  @Prop(Object) field!: IJSONTableField

  render(h: CreateElement) {
    if (!this.field) {
      return <div>加载中</div>
    }

    return <div class={style.panel}
      onClick={(e: Event) => {
        console.log('click')
        e.stopPropagation()
      }}
    >
      <el-form size="mini" label-position="top" label-width="80px" props={{ model: this.field }}>
        <el-form-item label="名称" prop="name">
          <el-input vModel={this.field.name}></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input vModel={this.field.description}></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select vModel={this.field.type}>
            <el-option label="文本" value="text"></el-option>
            <el-option label="单选" value="select"></el-option>
            <el-option label="多选" value="multiSelect"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button>取消</el-button>
          <el-button type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </div >
  }
}
