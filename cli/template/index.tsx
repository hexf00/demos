import { CreateElement } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import classnames from 'classnames'

import { <%= componentInterfaceName %> } from './types'
<% if (hasCss) { %>import style from './index.module.scss'<% } %>

@Component
export default class <%= componentName %> extends Vue {
  $props!: {
    <%= serviceObjName %>: <%= componentInterfaceName %>
  }

  @Prop() <%= serviceObjName %>!: <%= componentInterfaceName %>

<% if (hasForm) { %>
  /** 表单元素 */
  $refs!: {
    form: any
  }
<% } %>

  mounted() {
<% if (hasForm) { %>
    this.<%= serviceObjName %>.bindValidate(() => {
      return new Promise((resolve) => {
        this.$refs.form.getVnode().validate((valid: boolean) => {
          resolve(valid)
        })
      })
    })
<% } %>
  }

  render(h: CreateElement) {
    const <%= serviceObjName %> = this.<%= serviceObjName %>
    return <div class={classnames(<% if (hasCss) { %>style.component, <% } %>'manually-create')}>
<% if (hasForm) { %>
      <jk-Form ref="form" props={{ model: <%= serviceObjName %>.data }} rules={<%= serviceObjName %>.rules} autocomplete="off">
      </jk-Form>
<% } %>
    </div>
  }
}
