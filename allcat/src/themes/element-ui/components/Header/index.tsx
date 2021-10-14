import classnames from 'classnames'
import { CreateElement } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

import style from './index.module.scss'

import { NHeader } from './types'

@Component
export default class Header extends Vue {
  $props!: {
    service: NHeader.IView
  }

  @Prop() service!: NHeader.IView

  render (h: CreateElement) {
    const service = this.service
    const { name, description } = service.data

    return <div class={classnames(style.component)}>

      <div class={style.top}>
        <h1>{name}</h1>
        {description}
        <el-button>导入</el-button>
        <el-button onclick={() => service.export()}>导出</el-button>
      </div>
    </div>
  }
}
