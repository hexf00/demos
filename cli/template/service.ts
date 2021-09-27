import { <%= namespaceName %> } from './types'

export default class <%= serviceName %> implements <%= namespaceName %>.<%= componentInterfaceName %>,<%= namespaceName %>.<%= serviceInterfaceName %> {
  data!: <%= namespaceName %>.<%= dataInterfaceName %>

  /** 动态注册的函数 */
  callbacks : Partial<<%= namespaceName %>.ICallbacks>  = {}

  constructor (data?: Partial<<%= namespaceName %>.<%= dataInterfaceName %>>) {
    this.setData(data === undefined ? {} : data)
  }

  /** 获取默认数据 */
  private getDefaultData (): <%= namespaceName %>.<%= dataInterfaceName %> {
    return {}
  }

<% if (hasForm) { %>
  /** 校验规则 */
  rules = {}

  /** 注入校验实现 */
  bindValidate (fn: <%= namespaceName %>.ICallbacks['validate']): void {
    this.callbacks.validate = fn
  }
  
  /** 注销校验实现 */
  unbindValidate(){
    this.callbacks.validate = undefined
  }

  /** 校验 */
  validate (): Promise<boolean> {
    if (this.callbacks.validate) {
      return this.callbacks.validate()
    }
    return Promise.resolve(true)
  }
<% } %>

  /** 获取数据 */
  getData () {
    return this.data
  }

  /** 设置数据 */
  setData (data: Partial<<%= namespaceName %>.<%= dataInterfaceName %>>) {
    this.data = { ...this.getDefaultData(), ...data }
  }
}
