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
      context.helper('toDisplayString');
      break;
    case NodeTypes.ELEMENT:
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
