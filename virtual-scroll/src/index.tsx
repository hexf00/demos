import a from "./a";
import Vue from "vue";


let bullet = Vue.component("bullet",{
  props:{
    value:{
      type:String,
      default(){
        return ""
      }
    }
  },
  methods:{
    onKeyUp(e:KeyboardEvent){
      if(e.key == "Enter"){
        this.$emit("new");
        e.stopPropagation();
        e.preventDefault();
      }
      
    }
  },
  render(h){
    return <li ref="el" contenteditable="true" onKeydown={this.onKeyUp}>*&nbsp;{this.value}</li>
  }
})



new Vue({
  // el: "#app",
  data() {
    return {
      a: ["123"],
    }
  },
  methods:{
    New(){
      // console.log("New");
      this.a.push("");

    }
  },
  render(h) {
    return <span>
      {this.a.map(it=><bullet value={it} onNew={this.New} ></bullet>)}
    </span>
  }
}).$mount("#app");
