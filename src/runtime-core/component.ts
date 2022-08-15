import { shallowReadonly } from './../reactivity/reactive';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
import { emit } from './componentEmits';

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
    props: {},
    setupState: {},
    emit: () => {},
  };
  component.emit = emit.bind(null, component) as any;
  return component;
};
export const setupComponent = (instance) => {
  initProps(instance, instance.vnode.props);
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
    // 这里为什么使用浅响应
    // 猜测 保证props第一层始终指向父组件传入的值
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
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
