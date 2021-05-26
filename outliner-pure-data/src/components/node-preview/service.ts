import { INodePreview } from "."
import { NodePath } from "../../common/NodePath"

export default class NodePreviewService implements INodePreview {
  value = ''
  constructor(
    public focus: (nodePath: NodePath) => void
  ) {

  }

}
