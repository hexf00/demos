import classnames from 'classnames'
import { CreateElement } from 'vue'
import { Component, Prop, Vue<% if(!isServiceFromProps){ %>, Watch<% } %> } from 'vue-property-decorator'

<% if (hasCss) { %>import style from './index.module.scss'<% } %>
<% if (!isServiceFromProps) { %>import <%= serviceName %> from './service'<% } %>
import { <%= namespaceName %> } from './types'

@Component
export default class <%= componentName %> extends Vue {
<% if (hasForm) { %>
  /** 表单元素 */
  $refs!: {
    form: any
  }
<% } %>

<% if(isServiceFromProps){ %> 
  $props!: {
    <%= serviceObjName %>: <%= namespaceName %>.<%= componentInterfaceName %>
  }

  @Prop() <%= serviceObjName %>!: <%= namespaceName %>.<%= componentInterfaceName %>
<% } else { %>
  service: <%= namespaceName %>.<%= componentInterfaceName %> = new <%= serviceName %>()
<% } %> 

<% if (hasForm) { %>
  mounted() {
    this.<%= serviceObjName %>.bindValidate(() => {
      return new Promise((resolve) => {
        this.$refs.form.getVnode().validate((valid: boolean) => {
          resolve(valid)
        })
      })
    })
  }

  beforeDestroy () {
    this.service.unbindValidate()
  }
<% } %>

  render(h: CreateElement) {
    const <%= serviceObjName %> = this.<%= serviceObjName %>
    return (
    <div class={classnames(<% if (hasCss) { %>style.component<% } %>)}>
<% if (hasForm) { %>
      <jk-Form ref="form" props={{ model: <%= serviceObjName %>.data }} rules={<%= serviceObjName %>.rules} autocomplete="off">
      </jk-Form>
<% } else { %>
  {service.data}
<% } %>
    </div>
    )
  }
}
