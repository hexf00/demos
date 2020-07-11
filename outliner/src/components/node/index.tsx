import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";
import { FC } from "../../common/vue-tsx";
import DivInput, { IDivInput } from "../div-input";
import { INodeList } from "../node-list";
import NodePreview, { INodePreview } from "../node-preview";

export interface INode {
  root: INodeList;
  isShowEditor: boolean;
  showEditor: Function;
  hideEditor: Function;
  editor: IDivInput;
  preview: INodePreview;
  nodes: INode[];
  key: string;
}

const NodeComponent = FC<{ service: INode }>({
  functional: true,
  render(h, context) {
    const {
      root,
      isShowEditor,
      showEditor,
      editor,
      preview,
      nodes,
      key,
    } = context.props.service;
    let service = context.props.service;

    console.log("render isShowEditor", key, isShowEditor);

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

        //无引用

        return (
          <li key={key} key2={key}>
            <DivInput
              hideClass={isShowEditor ? "" : "hide"}
              service={editor}
            ></DivInput>
            <div class={isShowEditor ? "hide" : "refNode"}>
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
      } else {
        console.error("错误的节点");

        //无引用
        return (
          <li key={key} key2={key}>
            <DivInput
              hideClass={isShowEditor ? "" : "hide"}
              service={editor}
            ></DivInput>
            <NodePreview
              hideClass={isShowEditor ? "hide" : ""}
              service={preview}
            ></NodePreview>
            {list}
          </li>
        );
      }
    } else {
      //无引用
      return (
        <li key={key} key2={key}>
          <DivInput
            hideClass={isShowEditor ? "" : "hide"}
            service={editor}
          ></DivInput>
          <NodePreview
            hideClass={isShowEditor ? "hide" : ""}
            service={preview}
          ></NodePreview>
          {list}
        </li>
      );
    }
  },
});

export default NodeComponent;
