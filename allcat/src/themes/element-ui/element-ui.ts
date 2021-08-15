import Vue from 'vue'

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
  Tooltip,
  Form,
  FormItem,
  Select,
  Option,
  Switch,
  Tag,
  ColorPicker,
  Radio,
  RadioButton,
  RadioGroup,
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
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Switch)
Vue.use(Tag)
Vue.use(ColorPicker)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)

import CustomSelect from '@/components/select/index'
Vue.use(CustomSelect)