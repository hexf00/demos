
export namespace <%= namespaceName %> {
  export type <%= dataInterfaceName %> = {
    // TODO: 添加数据定义
  }
  
  export type ICallbacks = {
    validate : () => Promise<boolean>
  }

  export interface <%= componentInterfaceName %> {
    /** 数据 */
    data: <%= dataInterfaceName %>

    <% if (hasForm) { %>
      /** 校验规则 */
      rules: Record<string, any>
      /** UI中注入校验实现 */
      bindValidate (fn: ICallbacks['validate']): void
      /** 注销校验实现 */
      unbindValidate (): void
    <% } %>
  }

  export interface <%= serviceInterfaceName %>{
    callbacks: Partial<ICallbacks>
    /** 数据 */
    data: <%= dataInterfaceName %>

    <% if(!isServiceFromProps){ %>
      /** 设置数据 */
      setData (data: Partial<<%= dataInterfaceName %>>): void
    <% } %>
  }
}