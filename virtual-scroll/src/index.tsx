import a from "./a";
import Vue from "vue";

new Vue({
  // el: "#app",
  data() {
    return {
      a: 2,
    }
  },
  render(h) {
    return <span>
      <span>
        {this.a}
      </span>
    </span>
  }
}).$mount("#app");
