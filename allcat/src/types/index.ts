/** 基础数据 */
export interface IBase {
  /** 主键 */
  _id: string
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 删除自身 */
  remove(): void
}

/** 表操作 */
export interface ITableAction<T> {
  /** 通过表Id获取表 */
  getTableById(id: string): ITable<T> | null
  /** 添加表 */
  addTable(table: ITable<T>, index: number): ITable<T>
  /** 删除表 */
  removeTable(table: ITable<T>): void
  /** 移动表 */
  moveTable(table: ITable<T>, index: number): void
}

/** 视图操作 */
export interface IViewAction<T> {
  /** 通过ViewId获取视图 */
  getViewById(id: string): IView<T> | null
  /** 添加视图 */
  addView(view: IView<T>, index: number): IView<T>
  /** 删除视图 */
  removeView(table: IView<T>): void
  /** 移动视图 */
  moveView(table: IView<T>, index: number): void
}

/** 行操作 */
export interface IRowAction<T> {
  /** 通过RowId获取Row */
  getRowById(id: string): IView<T> | null
  /** 添加行数据 */
  addRow(row: IRow<T>, index?: number): IRow<T>
  /** 删除行数据 */
  removeRow(row: IRow<T>): void
  /** 移动行数据 */
  moveRow(row: IRow<T>, index: number): IRow<T>
}

/** 应用 */
export interface IApp extends IBase, ITableAction<unknown> {
  /** 表 */
  tables: Record<string, ITable<unknown>>
  /**  */
  tableSorts: ITable<unknown>[]
}

/** 表 */
export interface ITable<T> extends IBase, IViewAction<T>, IRowAction<T> {
  /** 表视图 */
  views: IView<T>[]
  /** 表字段配置 */
  fields: Record<string, IField>
  /** 表数据 */
  rows: Record<string, IRow<T>>
}

/** 视图 */
export interface IView<T> extends IBase, IRowAction<T> {
  /** 视图类型 */
  type: 'table'
  /** 视图字段配置 */
  fields: IField[]
  /** 数据 */
  rows: IRow<T>[]
}

/** 视图 */
export interface IField extends IBase {
  /** 字段数据类型 */
  type: 'text'
}

/** 行 */
export interface IRow<T> {
  /** 数据主键 */
  _id: string
  [key: string]: unknown
}