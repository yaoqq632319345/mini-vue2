import { createVNode, Fragment } from './../vnode';
export const renderSlots = (slots, name, props) => {
  const slot = slots[name];
  if (slot && typeof slot === 'function') {
    return createVNode(Fragment, {}, slot(props));
  }
};
