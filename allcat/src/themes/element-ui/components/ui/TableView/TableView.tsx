import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'

import { Table, TableColumn } from 'element-ui'

@Component(
  {
    components: {
      Table,
      TableColumn,
    },
  }
)
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    return <div>
      <div>TableView Name + Description</div>
      <div>
        table data
        <Table data={[{ name: '123' }]}>
          <TableColumn prop="date" label="日期" width="180"></TableColumn>
          <TableColumn prop="name" label="姓名" width="180"></TableColumn>
          <TableColumn prop="address" label="地址"></TableColumn>
        </Table>
      </div>
    </div>
  }
}