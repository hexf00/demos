import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'


@Component
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    return <div>
      <div>TableView Name + Description</div>
      <div>
        table data
        <el-table data={[{ name: '123' }]}>
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </div>
    </div>
  }
}