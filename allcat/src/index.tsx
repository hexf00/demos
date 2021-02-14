import Vue from "vue";
import ElementUIIndex from "@/themes/element-ui"
import NoUIIndex from '@/themes/no-ui'

new Vue({
  data() {
    return {
    };
  },
  render(h) {
    return (
      <ElementUIIndex></ElementUIIndex>
    );
  },
}).$mount("#app");
