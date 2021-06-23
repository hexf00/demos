export default class Logger {

  /** 是否将日志输出到控制台上 */
  isEnabled = false

  static loggers: Record<string, Logger> = {}

  static use(namespace: string) {
    if (!this.loggers[namespace]) {
      this.loggers[namespace] = new Logger(namespace)
    }

    return this.loggers[namespace]
  }

  private constructor(public nameSpace: string) {

  }

  enabled() {
    this.isEnabled = true
    return this
  }

  disabled() {
    this.isEnabled = false
    return this
  }

  log(...args: unknown[]) {
    this.isEnabled && console.log(this.nameSpace, ...args)
    return this
  }

  info(...args: unknown[]) {
    this.isEnabled && console.info(this.nameSpace, ...args)
    return this
  }

  warn(...args: unknown[]) {
    this.isEnabled && console.warn(this.nameSpace, ...args)
    return this
  }

  error(...args: unknown[]) {
    this.isEnabled && console.error(this.nameSpace, ...args)
    return this
  }

  count(flag: string) {
    this.isEnabled && console.count(this.nameSpace + ':' + flag)
    return this
  }
}