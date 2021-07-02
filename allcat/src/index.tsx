import Vue from 'vue'
import qs from 'qs'

import ElementUIIndex from '@/themes/element-ui'
import NoUIIndex from '@/themes/no-ui'
// import WsManager from './plugins/WsManager'

// const wsManager = new WsManager('ws://127.0.0.1:5920/message')

const query: { theme?: string } = qs.parse(location.search.substr(1))
const theme = query.theme || 'element-ui'

new Vue({
  data () {
    return {
      // wsManager,
    }
  },
  render (h) {
    switch (theme) {
      case 'no-ui':
        return <NoUIIndex></NoUIIndex>
        break
      case 'element-ui':
        return <ElementUIIndex></ElementUIIndex>
        break
      default:
        return <div>未知UI:{theme}</div>
    }
  },
}).$mount('#app')
