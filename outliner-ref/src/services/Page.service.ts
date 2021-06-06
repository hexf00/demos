import { IBlockService } from '@/components/Block/Block'
import { IDragInfo } from '@/types/dragInfo'
import { Inject, Root, Service } from 'ioc-di'
import DragService from './Drag.service'
import TreeService from './Tree.service'

@Root()
@Service()
export default class PageService {
  @Inject() tree!: TreeService
  @Inject() drag!: DragService<IBlockService>
}
