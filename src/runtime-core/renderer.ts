import { createComponentInstance, setupComponent } from './component';

export const render = (vnode: any, rootContainer) => {
  patch(vnode, rootContainer);
};

function patch(vnode: any, rootContainer: any) {
  processComponent(vnode, rootContainer);
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
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
