import { TO_DISPLAY_STRING, CREATE_ELEMENT_VNODE } from './runtimeHelpers';
import { NodeTypes } from './ast';

export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
  createRootCodegen(root);
  // 2. 给ast添加helpers
  root.helpers = [...context.helpers];
}

function createRootCodegen(root: any) {
  const child = root.children[0];
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode;
  } else {
    root.codegenNode = root.children[0];
  }
}

function createTransformContext(root: any, options: any): any {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Set(),
    helper(key) {
      context.helpers.add(key);
    },
  };

  return context;
}
function traverseNode(node: any, context) {
  const exitFns: any = [];
  context.nodeTransforms.forEach((nodeTransform) => {
    const onExit = nodeTransform(node, context);
    // 将插件返回值作为退出执行函数
    if (onExit) exitFns.push(onExit);
  });
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      traverseChildren(node, context);
      break;
    default:
      break;
  }
  // 先放入的后执行，倒着来
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}
function traverseChildren(node: any, context: any) {
  const { children } = node;
  // 这里不用判断了
  children.forEach((child) => {
    traverseNode(child, context);
  });
}
