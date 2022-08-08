const ProxyPropertiesMap = {
  $el: (instance) => instance.vnode.el,
};
export const PublicInstanceProxyHandlers = {
  get(target, key) {
    console.log('组件proxy包裹了一层, 对一个新对象进行代理', target);
    const { setupState } = target._;
    if (key in setupState) return setupState[key];

    const fn = ProxyPropertiesMap[key];
    if (fn) return fn(target._);
  },
};
