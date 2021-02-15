import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import ViewMenuItem from './components/TableItem/TableItem'

@Component
export default class extends Vue {

  activeNames = []
  mounted() {

  }

  render(h: CreateElement) {
    return <div>
      <el-collapse>
        <el-collapse-item name={1} title={'你好'}><ViewMenuItem></ViewMenuItem></el-collapse-item>
        <el-collapse-item name={2} title={'你好2'}><ViewMenuItem></ViewMenuItem></el-collapse-item>
        <el-button size="small">创建新表</el-button>
      </el-collapse>
    </div>
  }
}
