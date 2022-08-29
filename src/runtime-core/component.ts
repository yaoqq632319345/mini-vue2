import { shallowReadonly } from './../reactivity/reactive';
import { initProps } from './componentProps';
import { initSlots } from './componentSlots';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
import { emit } from './componentEmits';
import { proxyRefs } from '../reactivity';
let currentInstance: any = null;
export function getCurrentInstance() {
  return currentInstance;
}
function setCurrentInstance(i) {
  currentInstance = i;
}
export const createComponentInstance = (vnode, parent) => {
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
    slots: {},
    parent,
    provides: parent ? parent.provides : {},
    subTree: {},
    isMounted: false,
  };
  component.emit = emit.bind(null, component) as any;
  return component;
};
export const setupComponent = (instance) => {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  const setupResult = setupStatefulComponent(instance);
};

function setupStatefulComponent(instance: any): any {
  // 取出 App 组件的 setup
  const {
    type: { setup },
  } = instance;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  if (setup) {
    setCurrentInstance(instance);
    // 这里为什么使用浅响应
    // 猜测 保证props第一层始终指向父组件传入的值
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  // 取出 App 组件的 render
  const {
    type: { render, template },
  } = instance;
  if (render) {
    instance.render = render;
  } else {
    // 1. 先给render函数整出来
    if (compiler && template) {
      instance.render = compiler(template);
    }
  }
}

let compiler;
export function registerRuntimeCompiler(_compiler) {
  compiler = _compiler;
}
