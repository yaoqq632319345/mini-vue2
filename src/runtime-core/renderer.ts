import { createComponentInstance, setupComponent } from './component';

export const render = (vnode: any, rootContainer) => {
  patch(vnode, rootContainer);
};

function patch(vnode: any, rootContainer: any) {
  const { type } = vnode;
  if (typeof type === 'string') {
    processElement(vnode, rootContainer);
  } else {
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
  const { type, props, children } = vnode;
  const el: HTMLElement = document.createElement(type);
  for (let p in props) {
    el.setAttribute(p, props[p]);
  }
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
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
  const subTree = instance.render();
  patch(subTree, container);
}
