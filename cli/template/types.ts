export type <%= dataInterfaceName %> = {
  // TODO: 添加数据定义
}

/** 组件接口 */
export interface <%= componentInterfaceName %> {
  /** 数据 */
  data: <%= dataInterfaceName %>
<% if (hasForm) { %>
  /** 校验规则 */
  rules: Record<string, any>
  /** 注入校验实现 */
  bindValidate (fn: () => Promise<boolean>): void
<% } %>
<% if(!isServiceFromProps){ %>
  /** 设置数据 */
  setData (data: Partial<<%= dataInterfaceName %>>): void
<% } %>
}
