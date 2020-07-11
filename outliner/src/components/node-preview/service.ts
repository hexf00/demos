import { INodePreview } from "."

export default class NodePreviewService implements INodePreview {
  value = ''
  constructor(
    public focus: (key:string) => void
  ) {
    
  }

}
