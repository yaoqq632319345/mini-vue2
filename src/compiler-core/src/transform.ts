export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
}

function createTransformContext(root: any, options: any): any {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };

  return context;
}
function traverseNode(node: any, context) {
  context.nodeTransforms.forEach((nodeTransform) => {
    nodeTransform(node);
  });
  traverseChildren(node, context);
}
function traverseChildren(node: any, context: any) {
  const { children } = node;
  if (children && children.length) {
    children.forEach((child) => {
      traverseNode(child, context);
    });
  }
}
