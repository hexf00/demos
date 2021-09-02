import qs from 'qs'
import { CreateElement } from 'vue'
import { Component, Vue } from 'vue-property-decorator'

import ElementUIIndex from '@/themes/element-ui'
import NoUIIndex from '@/themes/no-ui'

import AppService from './service'
import { IApp, IAppData } from './types'

@Component
export default class App extends Vue {
  $props!: {
    value: IAppData
  }

  service: IApp = new AppService()

  theme = 'element-ui'

  created () {
    const query: { theme?: string } = qs.parse(location.search.substr(1))
    this.theme = query.theme || 'element-ui'

    this.service.wsService.init()
  }

  destroyed () {
    console.log('destroyed')
    this.service.wsService.unset()
  }

  render (h: CreateElement) {

    switch (this.theme) {
      case 'no-ui':
        return <NoUIIndex></NoUIIndex>
        break
      case 'element-ui':
        return <ElementUIIndex></ElementUIIndex>
        break
      default:
        return <div>未知UI:{this.theme}</div>
    }
  }
}
