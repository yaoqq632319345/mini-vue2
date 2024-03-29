import { ShapeFlags } from '../shared/ShapeFlags';

// vnode 的type 增加了 Fragment 和 Text 两个类型
export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

// 2. 解决调用render函数调用 createElementVNode 方法不存在
export { createVNode as createElementVNode };

// props 默认值
export const createVNode = (type, props?, children?) => {
  const vnode = {
    // type: string时，为tag， obj时，为组件配置对象
    type,
    props: props || {},
    key: props && props.key,
    children,
    // 对应第3步
    component: null,
    shapFlag: getShapFlag(type),
    el: null,
  };
  if (typeof children === 'string') {
    // 如果children 是 string ，则此vnode 的shapflag 标记 text_children
    vnode.shapFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    // 如果children 是 array ，则此vnode 的shapflag 标记 array_children
    vnode.shapFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  // 如果是个组件，并且children是对象
  if (
    vnode.shapFlag & ShapeFlags.STATEFUL_COMPONENT &&
    typeof children === 'object'
  ) {
    vnode.shapFlag |= ShapeFlags.SLOT_CHILDREN;
  }
  return vnode;
};
export function createTextVNode(text: string) {
  // 创建text类型的vnode, patch时根据type 来处理text
  return createVNode(Text, {}, text);
}
function getShapFlag(type: any) {
  // 根据类型判断vnode 是 组件 还是 元素
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
