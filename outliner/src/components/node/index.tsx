import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";
import { FC } from "../../common/vue-tsx";
import DivInput, { IDivInput } from "../div-input";
import { INodeList } from "../node-list";

export interface INode {
  root: INodeList;
  editor: IDivInput;
  nodes: INode[];
  key: string;
}

const NodeComponent = FC<{ service: INode }>({
  functional: true,
  render(h, context) {
    const { root, editor, nodes, key } = context.props.service;

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
          <li key={key}>
            <ul class="refNode">
              <NodeComponent service={refNode}></NodeComponent>
            </ul>
            {list}
          </li>
        );
      } else {
        console.error("错误的节点");

        //无引用
        return (
          <li key={key}>
            <DivInput service={editor}></DivInput>
            {list}
          </li>
        );
      }
    } else {
      //无引用
      return (
        <li key={key}>
          <DivInput service={editor}></DivInput>
          {list}
        </li>
      );
    }
  },
});

export default NodeComponent;
