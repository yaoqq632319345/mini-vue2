import { createVNode } from './vnode';
// 调用 h 函数返回 vnode
export function h(type, props?, children?) {
  return createVNode(type, props, children);
}
