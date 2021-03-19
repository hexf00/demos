import axios from 'axios'
import fs from 'fs'


type PartialExclde<T, K extends keyof T> = {
  [P in keyof T]?: T[P]
} & {
    [key in K]: T[K]
  }


const main = async () => {
  let tasker = new Tasker({
    name: '知乎评论',
    urlTpl: 'https://www.zhihu.com/api/v4/answers/1773841600/comments?order=normal&limit=${limit}&offset=${offset}',
    updateCount: (body: unknown) => {
      const { common_counts } = body as { common_counts: number }
      return common_counts
    }
  })

  console.log('start')
  let i = 1;
  while (tasker.next()) {
    const hasCache = tasker.hasCache()
    console.log('loop', i, tasker.url, `hasCache:${hasCache}`)
    if (hasCache) {
      if (i == 1) {
        tasker.loadCache()
        tasker.updateCount()
      }
    } else {
      await tasker.get()
      tasker.updateCount()
      tasker.save()
    }
    i++;
  }
  console.log('end')
}

/** 任务配置 */
type options = {
  /** 任务名称 */
  name: string,
  /** url模板 */
  urlTpl: string,
  /** 每页数量 */
  limit: number,
  /** 更新记录总数 */
  updateCount: (body: unknown) => number,
}

class Tasker {
  /** 至少要执行一次，count>offset */
  count = 1
  offset = 0
  cacheData: unknown
  url = ''

  options: options = {
    name: 'deafult_task',
    urlTpl: '',
    limit: 20,
    updateCount: () => 0
  }

  get file() {
    const { name, limit } = this.options
    const { offset } = this
    return `./${name}-${offset - limit}-${offset}.json`
  }

  constructor(opts: PartialExclde<options, 'urlTpl' | 'updateCount'>) {
    Object.assign(this.options, opts)
  }

  async get() {
    let { url } = this
    console.log('get', url)
    let res = await axios.get(url)
    this.cacheData = res.data

    return this
  }

  next() {
    let { count, offset } = this
    if (offset > count) {
      return false
    } else {
      const { urlTpl, limit } = this.options
      this.url = eval(`\`${urlTpl}\``)
      this.offset += limit//递增
      return true
    }
  }

  updateCount() {
    const { updateCount } = this.options
    const count = updateCount(this.cacheData)
    if (this.count != count) {
      this.count = count
      console.log('updateCount', this.count)
    }
  }

  hasCache() {
    const { file } = this
    if (fs.existsSync(file)) {
      return true
    } else {
      return false
    }
  }

  loadCache() {
    console.log('loadCache', this.url)
    const { file } = this
    this.cacheData = JSON.parse(fs.readFileSync(file).toString())
    return this
  }

  save() {
    console.log('save', this.url)
    const { file, cacheData } = this
    fs.writeFileSync(file, JSON.stringify(cacheData, null, 2))
    return this
  }
}

main()