import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";
import { FC } from "../../common/vue-tsx";
import DivInput, { IDivInput } from "../div-input";
import { INodeList } from "../node-list";

export interface INode {
  root: INodeList;
  isShowEditor: boolean;
  showEditor: Function;
  hideEditor: Function;
  editor: IDivInput;
  nodes: INode[];
  key: string;
}

const NodeComponent = FC<{ service: INode }>({
  functional: true,
  render(h, context) {
    const {
      root,
      isShowEditor: showEditorStatus,
      showEditor,
      editor,
      nodes,
      key,
    } = context.props.service;
    let service = context.props.service;

    //子节点，无论如何都是应该显示的
    let list =
      nodes.length > 0 ? (
        <ul>
          {nodes.map((node) => (
            <NodeComponent service={node}></NodeComponent>
          ))}
        </ul>
      ) : (
        ""
      );

    let r = editor.value.match(/\{\{(.*?)\}\}/);
    if (r) {
      //存在引用
      console.log(r[1]);

      if (root.dict[r[1]]) {
        console.log(root.dict[r[1]]);
        let refNode = root.dict[r[1]];

        let preview = (
          <li key={key}  key2={key}>
            <div class="refNode">
              <i class="edit" onClick={() => service.showEditor()}>
                修改
              </i>
              <ul>
                <NodeComponent service={refNode}></NodeComponent>
              </ul>
            </div>
            {list}
          </li>
        );

        let editorEL = (
          <li key={key}  key2={key}>
            <DivInput service={editor}></DivInput>
            {list}
          </li>
        );

        //无引用
        return showEditorStatus ? editorEL : preview;
      } else {
        console.error("错误的节点");

        //无引用
        return (
          <li key={key}  key2={key}>
            <DivInput service={editor}></DivInput>
            {list}
          </li>
        );
      }
    } else {
      //无引用
      return (
        <li key={key}  key2={key}>
          <DivInput service={editor}></DivInput>
          {list}
        </li>
      );
    }
  },
});

export default NodeComponent;
