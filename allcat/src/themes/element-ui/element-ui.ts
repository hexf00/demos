import Vue from 'vue'
import ElSelect from 'element-ui/lib/select'

// ElSelect mixin添加clickoutside事件
(ElSelect as any).methods.handleClose = function () {
  this.visible = false
  this.$emit('clickoutside')
}
import {
  Button,
  Dialog,
  Table,
  TableColumn,
  Tree,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Popover,
  Form,
  FormItem,
  Select,
  Option,
  Switch,
} from 'element-ui'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Popover)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Switch)