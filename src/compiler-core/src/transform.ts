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
  root.codegenNode = root.children[0];
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
  context.nodeTransforms.forEach((nodeTransform) => {
    nodeTransform(node);
  });
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ELEMENT:
      context.helper(CREATE_ELEMENT_VNODE);
      traverseChildren(node, context);
    case NodeTypes.ROOT:
      traverseChildren(node, context);
      break;
    default:
      break;
  }
}
function traverseChildren(node: any, context: any) {
  const { children } = node;
  // 这里不用判断了
  children.forEach((child) => {
    traverseNode(child, context);
  });
}
