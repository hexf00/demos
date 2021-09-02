
class WsManager {
  ws: WebSocket

  subscriptionProxies: Record<string, {
    funcs: ((data: unknown) => void)[]
  }> = {}

  heartCheck = {
    timeout: 60000,
    timeoutObj: 0,
    isStart: false,
    reset: function () {
      clearTimeout(this.timeoutObj)
      this.start()
    },
    start: () => {
      this.heartCheck.isStart = true
      this.heartCheck.timeoutObj = window.setTimeout(() => {
        this.reconnect()
      }, this.heartCheck.timeout)
    },
  }

  constructor (public url: string) {
    this.ws = new WebSocket(this.url)
    this.initEventHandler(this.ws)
  }

  initEventHandler (ws: WebSocket) {
    const { heartCheck } = this
    ws.onopen = function () {
      console.log('ws:连接已建立...')
    }

    ws.onmessage = (e) => {
      heartCheck.isStart && heartCheck.reset()
      if (!e.data) {
        return
      }

      const { event, data } = JSON.parse(e.data) as { event: string; data: unknown }
      if (event === 'heartbeatConfig') {
        clearTimeout(this.heartCheck.timeoutObj)
        const time = (data as { time: number }).time
        heartCheck.timeout = time + 1000
        heartCheck.start()
        console.log(`ws:开启心跳监听：${time}`)
        return
      }

      const subscriptionProxy = this.subscriptionProxies[event]
      subscriptionProxy && subscriptionProxy.funcs.forEach(func => func(data))

      console.log('ws:数据已接收...', event, data)
    }

    ws.onerror = (e) => {
      console.log('ws:出错...', e)
      this.reconnect()
    }

    ws.onclose = () => {
      console.log('ws:连接已关闭...')
      this.reconnect()
    }
  }

  emit (event: string, data: any) {
    this.ws.send(JSON.stringify({
      event,
      data,
    }))
  }

  reconnect () {
    clearTimeout(this.heartCheck.timeoutObj)
    this.heartCheck.isStart = false
    setTimeout(() => {
      this.ws = new WebSocket(this.url)
      this.initEventHandler(this.ws)
    }, 1000)
  }

  /**
   * 监听
   */
  on (actionName: string, fn: () => void) {
    if (!actionName || !fn) {
      throw new Error('WsProxy监听注册 入参错误')
    }
    let subscriptionProxy = this.subscriptionProxies[actionName]
    if (!subscriptionProxy) {
      subscriptionProxy = {
        funcs: [],
      }
      this.subscriptionProxies[actionName] = subscriptionProxy
    }

    subscriptionProxy.funcs.push(fn)
  }

  /**
     * 注销
     */
  off (actionName: string, fn: () => void) {
    if (!actionName || !fn) {
      throw new Error('WsProxy监听注销 入参错误')
    }

    const subscriptionProxy = this.subscriptionProxies[actionName]
    if (subscriptionProxy) {
      const { funcs } = subscriptionProxy
      const index = funcs.indexOf(fn)
      if (index !== -1) {
        funcs.splice(index, 1)
      }
      if (funcs.length === 0) {
        delete this.subscriptionProxies[actionName]
      }
    }

  }
}

export default WsManager