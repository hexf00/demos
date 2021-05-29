import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './index.module.scss'
import Clickoutside from '@/directives/clickoutside'

@Component({
  directives: { Clickoutside },
})
export default class ColorPicker extends Vue {

  @Prop(String) value!: string

  isShow = false

  render(h: CreateElement) {
    const value = this.value
    const predefineColors = [
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff',
      '#c71585',
    ]

    return <el-popover
      props={{
        value: this.isShow,
        trigger: 'manual',
        'visible-arrow': false,
        width: '280',
      }}
      {...{
        directives: [{
          name: 'Clickoutside',
          value: ({ mouseup, mousedown }: { mouseup: MouseEvent; mousedown: MouseEvent }) => {
            this.isShow = false
          },
        }],
      }}
      scopedSlots={{
        default: () => {
          return <div class="el-color-predefine__colors">
            {predefineColors.map((color, index) => {
              return <div
                key={index}
                class={{
                  selected: color === value,
                  'el-color-predefine__color-selector': true,
                }}
                on={{
                  click: () => {
                    console.log(this.isShow, 'this.isShow')
                    this.$emit('input', color)
                    this.isShow = false
                  },
                }}>
                <div style={{ 'background-color': color }}>
                </div>
              </div>
            })}

          </div>
        },
        reference: () => {
          return <div class="el-color-picker el-color-picker--mini">
            <div class="el-color-picker__trigger" on={{
              click: () => {
                console.log('click')
                this.isShow = true
              },
            }}>
              <span class="el-color-picker__color " >
                <span class="el-color-picker__color-inner" style={{
                  backgroundColor: value,
                }}>
                </span>
              </span>
              <span class="el-color-picker__icon el-icon-arrow-down"></span>
            </div>
          </div>
        },
      }}
    />
  }
}
