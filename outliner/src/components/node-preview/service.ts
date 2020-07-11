import { INodePreview } from "."

export default class NodePreviewService implements INodePreview {
  value = ''
  constructor(

    private onClickCallback: () => void

  ) {
    
  }

  onClick() {
    this.onClickCallback();
  }
}
