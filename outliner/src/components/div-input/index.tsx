import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'


export interface IDivInput {
  value: string
  onInput: (value: string) => void
  onEnter: () => void
  bindFocus: (callback: () => void) => void
}

@Component
export default class DivInput extends Vue {
  $props!: { service: IDivInput }
  $el!: HTMLElement
  @Prop() service!: IDivInput

  mounted() {
    this.$watch('service.value', () => {
      console.log("watch", this.service.value);
      // if (this.service.value !== this.$el.innerText) {
        this.$el.innerHTML = this.service.value
      // }else{
      //   console.log("!!");
      // }
    }, { immediate: true })

    this.service.bindFocus(() => {
      this.$el.focus()
      // getSelection()?.collapse(this.$el, this.service.value ? 1 : 0)
    })
  }


  render(h: CreateElement) {

    return <div
      contenteditable
      onkeydown={(event: KeyboardEvent) => {
        if (event.keyCode === 13) {
          this.service.onEnter()
          event.preventDefault()
        }
      }}
      onBlur={
        ({ currentTarget }: { currentTarget: HTMLDivElement }) => {
          this.service.onInput(currentTarget.innerText)
        }
      }
    >{this.service.value}</div>
  }
}