import { ShapeFlags } from '../shared/ShapeFlags';

// props 默认值
export const createVNode = (type, props?, children?) => {
  const vnode = {
    // type: string时，为tag， obj时，为组件配置对象
    type,
    props: props || {},
    children,
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
function getShapFlag(type: any) {
  // 根据类型判断vnode 是 组件 还是 元素
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
