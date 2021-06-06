import { Inject, Root, Service } from 'ioc-di'
import TreeService from './Tree.service'
@Root()
@Service()
export default class PageService {
  @Inject() tree!: TreeService
}
