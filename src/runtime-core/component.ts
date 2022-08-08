import { PublicInstanceProxyHandlers } from './componentPublicInstance';

export const createComponentInstance = (vnode) => {
  /**
   * example {
   *  vnode: {
   *    type: { setup: xxx, render: xxx }
   *  },
   *  type: {
   *    { setup: xxx, render: xxx }
   *  }
   * }
   */
  const component = {
    vnode,
    type: vnode.type,
  };
  return component;
};
export const setupComponent = (instance) => {
  // TODO: initProps
  // TODO: initSlots
  const setupResult = setupStatefulComponent(instance);
};

function setupStatefulComponent(instance: any): any {
  // 取出 App 组件的 setup
  const {
    type: { setup },
  } = instance;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  if (setup) {
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  // 取出 App 组件的 render
  const {
    type: { render },
  } = instance;
  if (render) {
    instance.render = render;
  }
}
