import { NodeTypes } from './ast';

export function transform(root) {
  traverseNode(root);
}
function traverseNode(node: any) {
  if (node.type === NodeTypes.TEXT) {
    node.content += 'mini-vue';
  }
  const { children } = node;
  if (children && children.length) {
    children.forEach((child) => {
      traverseNode(child);
    });
  }
}
