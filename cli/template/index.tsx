import { CreateElement } from 'vue'
import { Component, Prop, Vue<% if(!isServiceFromProps){ %>, Watch<% } %> } from 'vue-property-decorator'
import classnames from 'classnames'


<% if (!isServiceFromProps) { %>import <%= serviceName %> from './service'<% } %>
import { <%= componentInterfaceName %><% if(!isServiceFromProps){ %>, <%= dataInterfaceName %><% } %> } from './types'
<% if (hasCss) { %>import style from './index.module.scss'<% } %>

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
    <%= serviceObjName %>: <%= componentInterfaceName %>
  }

  @Prop() <%= serviceObjName %>!: <%= componentInterfaceName %>
<% } else { %>
  $props!: {
    value: <%= dataInterfaceName %>
  }

  @Prop() value!: <%= dataInterfaceName %>
  @Watch('value', { immediate: true })
  onValueChange (value: <%= dataInterfaceName %>) {
    this.service.setData(value)
  }

  service: <%= componentInterfaceName %> = new <%= serviceName %>()
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
