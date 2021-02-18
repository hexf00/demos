import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class EyeSwitch extends Vue {
  @Prop(Object)
  value!: boolean

  render(h: Vue.CreateElement) {
    const { value } = this
    if (value) {
      return <el-button type="text" size="mini">
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.63 6.35a.75.75 0 0 1 1.02.28L3 7l.65-.37.01.01.06.1.25.34c.24.29.6.68 1.12 1.08A7.8 7.8 0 0 0 10 9.75c2.31 0 3.9-.8 4.91-1.6a6.84 6.84 0 0 0 1.43-1.5l.01-.02a.75.75 0 0 1 1.3.74L17 7l.65.37v.01l-.01.01a2.5 2.5 0 0 1-.11.18 8.34 8.34 0 0 1-1.7 1.77A9.3 9.3 0 0 1 10 11.25a9.3 9.3 0 0 1-5.84-1.9 8.34 8.34 0 0 1-1.8-1.96v-.01h-.01L3 7l-.65.37a.75.75 0 0 1 .28-1.02zm13.72.28z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.76 10.29c.4-.13.82.08.95.47l.5 1.5a.75.75 0 0 1-1.42.48l-.5-1.5a.75.75 0 0 1 .47-.95zM14.58 8.38a.75.75 0 0 1 1.04.2l1 1.5a.75.75 0 1 1-1.24.84l-1-1.5a.75.75 0 0 1 .2-1.04zM5.42 8.38c.34.23.43.7.2 1.04l-1 1.5a.75.75 0 1 1-1.24-.84l1-1.5a.75.75 0 0 1 1.04-.2zM8.24 10.29c.39.13.6.55.47.95l-.5 1.5a.75.75 0 0 1-1.42-.48l.5-1.5c.13-.39.55-.6.95-.47z"></path></svg>
      </el-button>
    } else {
      return <el-button type="text" size="mini">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M11.99 16.59c2.35 0 4.53-1.46 6.56-4.6-1.97-3.13-4.15-4.58-6.56-4.58-2.41 0-4.58 1.45-6.54 4.58 2.01 3.15 4.18 4.6 6.54 4.6zm0-10.59c3.14 0 5.8 2 8.01 6-2.26 4-4.93 6-8.01 6S6.25 16 4 12c2.19-4 4.85-6 7.99-6zM12 9.18c-1.6 0-2.9 1.26-2.9 2.82 0 1.56 1.3 2.82 2.9 2.82 1.6 0 2.9-1.26 2.9-2.82 0-1.56-1.3-2.82-2.9-2.82zm0 1.4c.8 0 1.45.64 1.45 1.42 0 .78-.65 1.41-1.45 1.41-.8 0-1.45-.63-1.45-1.41 0-.78.65-1.41 1.45-1.41z"></path></g></svg>
      </el-button>
    }
  }
}