import { <%= componentInterfaceName %>, <%= dataInterfaceName %> } from './types'

export default class <%= serviceName %> implements <%= componentInterfaceName %> {
  data: <%= dataInterfaceName %>

  /** 动态注册的函数 */
  callbacks = {
<% if (hasForm) { %>
    validate: () => { return Promise.resolve(true) }
<% } %>
  }

  constructor (data?: <%= dataInterfaceName %>) {
    this.data = { ...this.getDefaultData(), ...data }
  }

  /** 获取默认数据 */
  private getDefaultData (): <%= dataInterfaceName %> {
    return {}
  }

<% if (hasForm) { %>
  rules = {}

  /** 注入校验实现 */
  bindValidate (fn: () => Promise<boolean>): void {
    this.callbacks.validate = fn
  }

  /** 校验 */
  validate (): Promise<boolean> {
    return this.callbacks.validate()
  }
<% } %>

  getData () {
    return this.data
  }
}
