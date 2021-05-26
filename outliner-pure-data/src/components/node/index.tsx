import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";
import { FC } from "../../common/vue-tsx";
import DivInput, { IDivInput } from "../div-input";
import { INodeList } from "../node-list";
import NodePreview, { INodePreview } from "../node-preview";
import { NodePath } from "../../common/NodePath";

export interface INode {
  root: INodeList;
  isShowEditor: boolean;
  hideEditor: Function;
  editor: IDivInput;
  preview: INodePreview;
  currentFocusPath?: NodePath;
  nodes: INode[];
  key: string;
  focus: Function;
}

@Component
export default class NodeComponent extends Vue {
  $props!: { service: INode; key?: string; class?: string };
  @Prop() service!: INode;

  render(h: CreateElement) {
    const {
      root,
      isShowEditor,
      editor,
      preview,
      currentFocusPath,
      nodes,
      key,
    } = this.service;
    let service = this.service;

    // console.log("render isShowEditor", key, isShowEditor);

    //isShowEditor 需要进行双重判断。 只改变当前激活的节点（鼠标所在，光标所在）
    // console.error(isShowEditor, key, currentFocusPath);
    let input =
      isShowEditor &&
      currentFocusPath &&
      currentFocusPath.isEqual(this?.$vnode?.key) ? (
        <DivInput service={editor}></DivInput>
      ) : (
        ""
      );
    let previewC =
      isShowEditor &&
      currentFocusPath &&
      currentFocusPath.isEqual(this?.$vnode?.key) ? (
        ""
      ) : (
        <NodePreview service={preview}></NodePreview>
      );

    //子节点，无论如何都是应该显示的
    let list =
      nodes.length > 0 ? (
        <ul>
          {nodes.map((node) => (
            <NodeComponent
              key={this?.$vnode?.key + "-" + node.key}
              service={node}
            ></NodeComponent>
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

        let previewC2 =
          isShowEditor &&
          currentFocusPath &&
          currentFocusPath.isEqual(this?.$vnode?.key) ? (
            ""
          ) : (
            <div class="refNode">
              <i
                class="edit"
                onClick={() => {
                  let key = this.$vnode?.key;
                  key && this.service.focus(new NodePath(key.toString()));
                }}
              >
                修改
              </i>
              <ul>
                <NodeComponent
                  key={this.$vnode?.key + "-" + refNode.key}
                  node-role="ref-root"
                  service={refNode}
                ></NodeComponent>
              </ul>
            </div>
          );

        //无引用

        //ref 用来标准是否为引用的根节点
        return (
          <li>
            {input}
            {previewC2}
            {list}
          </li>
        );
      } else {
        console.error("错误的节点");

        //无引用
        return (
          <li>
            {input}
            {previewC}
            {list}
          </li>
        );
      }
    } else {
      //无引用
      return (
        <li>
          {input}
          {previewC}
          {list}
        </li>
      );
    }
  }
}
