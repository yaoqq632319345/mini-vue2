import { hasOwn } from '../shared/shared';
const ProxyPropertiesMap = {
  $el: (instance) => instance.vnode.el,
  $emit: (instance) => instance.emit,
  $slots: (instance) => instance.slots,
  $props: (instance) => instance.props,
};
export const PublicInstanceProxyHandlers = {
  get(target, key) {
    // console.log('组件proxy包裹了一层, 对一个新对象进行代理', target);
    const { setupState, props } = target._;
    // 取值顺序
    if (hasOwn(setupState, key)) return setupState[key];
    else if (hasOwn(props, key)) return props[key];

    const fn = ProxyPropertiesMap[key];
    if (fn) return fn(target._);
  },
};
