import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment, Text } from './vnode';
export const render = (vnode: any, rootContainer) => {
  patch(vnode, rootContainer, null);
};

function patch(vnode: any, rootContainer: any, parentComponent) {
  const { shapFlag, type } = vnode;
  // 增加两个类型的处理逻辑
  switch (type) {
    case Fragment:
      processFragment(vnode, rootContainer, parentComponent);
      break;
    case Text:
      processText(vnode, rootContainer);
      break;
    default:
      if (shapFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, rootContainer, parentComponent);
      } else if (shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, rootContainer, parentComponent);
      }
  }
}
// 直接挂载子元素
function processFragment(vnode: any, rootContainer: any, parentComponent) {
  const { children } = vnode;
  mountChildren(children, rootContainer, parentComponent);
}
// text 类型直接创建textnode 并插入
function processText(vnode: any, rootContainer: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  rootContainer.appendChild(textNode);
}
function processElement(vnode: any, rootContainer: any, parentComponent) {
  mountElement(vnode, rootContainer, parentComponent);
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}
// 元素挂载流程: 创建dom -> 初始化props、事件，-> 递归子元素
function mountElement(vnode: any, container: any, parentComponent) {
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
    mountChildren(children, el, parentComponent);
  }
  container.appendChild(el);
}
function mountChildren(children: any, el: HTMLElement, parentComponent) {
  children.forEach((v) => {
    patch(v, el, parentComponent);
  });
}

// 组件挂载 流程 创建组件实例 -> 调用setup (初始化 props ,slots, 并设置render 方法) -> 处理子元素 (调用组件render方法得到vnode, patch vnode得到真实dom, 并赋值给instance.vnode.el)
function mountComponent(vnode: any, container: any, parentComponent) {
  // 创建组件实例
  const instance = createComponentInstance(vnode, parentComponent);
  // 设置组件setup
  setupComponent(instance);

  // 处理子节点
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  // Implement
  const subTree = instance.render.call(instance.proxy);

  patch(subTree, container, instance);
  // subTree 子元素 这时的用例是一个element, 所以有el 属性， 赋值给组件实例
  instance.vnode.el = subTree.el;
}
