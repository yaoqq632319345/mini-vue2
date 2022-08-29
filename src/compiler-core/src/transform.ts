export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
  createRootCodegen(root);
}

function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
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
