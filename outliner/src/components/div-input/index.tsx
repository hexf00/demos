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
  $props!: { service: IDivInput };
  $el!: HTMLElement;

  $refs!: {
    input: HTMLInputElement;
  };

  @Prop() service!: IDivInput;

  mounted() {
    this.$watch(
      "service.value",
      () => {
        console.log("watch", this.service.value);
        if (this.service.value !== this.$refs.input.innerText) {
          this.$refs.input.innerHTML = this.service.value;
        } else {
          console.log("!!");
        }
      },
      { immediate: true }
    );

    this.service.bindFocus(() => {
      this.$refs.input.focus();
    });
  }

  render(h: CreateElement) {
    return (
      <div>
        <div
          ref="input"
          class="input"
          contenteditable
          onkeydown={(event: KeyboardEvent) => {
            if (event.keyCode === 13) {
              this.service.onEnter();
              event.preventDefault();
            }
          }}
          onInput={({ currentTarget }: { currentTarget: HTMLDivElement }) => {
            this.service.onInput(currentTarget.innerText);
          }}
        ></div>
      </div>
    );
  }
}
