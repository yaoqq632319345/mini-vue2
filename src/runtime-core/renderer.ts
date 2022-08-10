import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';

export const render = (vnode: any, rootContainer) => {
  patch(vnode, rootContainer);
};

function patch(vnode: any, rootContainer: any) {
  const { shapFlag } = vnode;
  if (shapFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, rootContainer);
  } else if (shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, rootContainer);
  }
}

function processElement(vnode: any, rootContainer: any) {
  mountElement(vnode, rootContainer);
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, props, children, shapFlag } = vnode;
  const el: HTMLElement = (vnode.el = document.createElement(type)); // 处理element vnode 有el属性
  for (let p in props) {
    const val = props[p];
    const isOn = (k: string) => /^on[A-Z]/.test(k);
    if (isOn(p)) {
      const eventName = p.slice(2).toLowerCase();
      el.addEventListener(eventName, val);
    } else {
      el.setAttribute(p, props[p]);
    }
  }
  if (shapFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapFlag & ShapeFlags.ARRAY_CHILDREN) {
    children.forEach((v) => {
      patch(v, el);
    });
  }
  container.appendChild(el);
}
function mountComponent(vnode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(vnode);
  // 设置组件setup
  setupComponent(instance);

  // 处理子节点
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  // Implement
  const subTree = instance.render.call(instance.proxy);

  patch(subTree, container);
  // subTree 子元素 这时的用例是一个element, 所以有el 属性， 赋值给组件实例
  instance.vnode.el = subTree.el;
}
