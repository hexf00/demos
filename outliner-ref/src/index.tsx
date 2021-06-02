import Vue from 'vue'

import router from '@/router'

new Vue({
  router,
  data() {
    return {
    }
  },
  render(h) {
    return <router-view></router-view>
  },
}).$mount('#app')
