export type <%= dataInterfaceName %> = {
  // TODO: 添加数据定义
}

export interface <%= componentInterfaceName %> {
  data: <%= dataInterfaceName %>
<% if (hasForm) { %>
  /** 校验规则 */
  rules: Record<string, any>
  /** ui注入校验实现 */
  bindValidate (fn: () => Promise<boolean>): void
<% } %>
}
