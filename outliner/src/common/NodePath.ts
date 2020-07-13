export class NodePath {

  pathList: string[] = [];
  pathString: string = '';

  constructor(path?: string | string[]) {
    path && this.setPath(path);
  }
  setPath(path: string | string[]) {

    let pathList: string[];
    if (typeof path === 'string') {
      pathList = path.split('-');
    } else {
      pathList = path;
    }

    this.pathList = pathList;
    this.pathString = this.pathList.join("-");
    return this;
  }

  cd(path: string) {
    this.setPath(this.pathList.concat(path));
    return this;
  }

  isEqual(path: number | string | string[] | NodePath | undefined) {
    if (path === undefined) {
      return false;
    }

    if (typeof path === 'string') {
      return this.pathString === path;
    } else if (typeof path === 'number') {
      return this.pathString === path.toString();
    } else if (Array.isArray(path)) {
      return this.pathString === path.join("-");
    } else {
      return this.pathString === path.pathString;
    }
  }

  getParent(parentKey?: string) {
    let lastIndex;
    if (parentKey === undefined /** 不传为获取父路径 */) {
      lastIndex = this.pathList.length > 1 ? this.pathList.length - 2 : -1;
    } else if (parentKey === "" /** 根路径 */) {
      lastIndex = -1;
    } else {
      lastIndex = this.pathList.lastIndexOf(parentKey);
    }

    if (lastIndex !== -1) {
      let list = this.pathList.slice(0, lastIndex + 1);
      return new NodePath(list);
    } else {
      return new NodePath();
    }
  }

  moveTo(newParent: NodePath) {
    //自身
    let curr = this.pathList.pop();

    let list = newParent.pathList.slice();
    if (curr) {
      list.push(curr);
    }

    this.setPath(list);
  }
}
