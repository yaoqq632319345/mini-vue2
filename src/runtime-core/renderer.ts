import { effect } from './../reactivity/effect';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';
import { EMPTY_OBJ } from '../shared/shared';
// 将render封装， 内部dom方法，全部由外部传入
export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    createTextNode: hostCreateTextNode,
    setElementText: hostSetElementText,
    remove: hostRemove,
  } = options;
  function render(vnode: any, rootContainer) {
    patch(null, vnode, rootContainer, null);
  }

  // n1代表old vnode
  function patch(n1, n2, rootContainer: any, parentComponent) {
    const { shapFlag, type } = n2;
    // 增加两个类型的处理逻辑
    switch (type) {
      case Fragment:
        processFragment(n1, n2, rootContainer, parentComponent);
        break;
      case Text:
        processText(n1, n2, rootContainer);
        break;
      default:
        if (shapFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, rootContainer, parentComponent);
        } else if (shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, rootContainer, parentComponent);
        }
    }
  }
  // 直接挂载子元素
  function processFragment(n1, n2, rootContainer: any, parentComponent) {
    const { children } = n2;
    mountChildren(children, rootContainer, parentComponent);
  }
  // text 类型直接创建textnode 并插入
  function processText(n1, n2: any, rootContainer: any) {
    const { children } = n2;
    const textNode = (n2.el = hostCreateTextNode(children));
    hostInsert(textNode, rootContainer);
  }
  function processElement(n1, n2: any, rootContainer: any, parentComponent) {
    if (!n1) {
      // 如果n1 不存在，挂载流程
      mountElement(n2, rootContainer, parentComponent);
    } else {
      patchElement(n1, n2, rootContainer, parentComponent);
    }
  }
  function patchElement(n1, n2, container, parentComponent) {
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(n1, n2, container, parentComponent) {
    const { shapFlag, children: c2 } = n2;
    const { shapFlag: prevShapFlag, children: c1 } = n1;
    if (shapFlag & ShapeFlags.TEXT_CHILDREN /* 新节点是文本 */) {
      if (
        prevShapFlag & ShapeFlags.ARRAY_CHILDREN /* 如果老节点是数组，先移除 */
      ) {
        unMountedChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } /* 新节点是数组 */ else {
      if (prevShapFlag & ShapeFlags.TEXT_CHILDREN /* 老节点是text */) {
        hostSetElementText(container, '');
        mountChildren(c2, container, parentComponent);
      } /* 老节点也是array */ else {
        patchKeyedChildren(c1, c2, container, parentComponent);
      }
    }
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function patchKeyedChildren(c1, c2, container, parentComponent) {
    let i = 0,
      l1 = c1.length,
      e1 = l1 - 1,
      l2 = c2.length,
      e2 = l2 - 1;
    // 左侧diff,  i++   node 取 c[i]
    while (i <= e1 && i <= e2) {
      const n1 = c1[i],
        n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent);
      } else {
        break;
      }
      i++;
    }
    // 旧的没了
    if (i > e1) {
      // 新的还有
      if (i <= e2) {
        // 需要创建
        while (i <= e2) {
          const n2 = c2[i++];
          patch(null, n2, container, parentComponent);
        }
      }
    }
  }
  function unMountedChildren(c1: any) {
    c1.forEach((node) => {
      hostRemove(node.el);
    });
  }
  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return;
    for (let k in newProps) {
      const newV = newProps[k];
      const oldV = oldProps[k];
      if (newV !== oldV) {
        hostPatchProp(el, k, newV, oldV);
      }
    }
    for (let k in oldProps) {
      if (!(k in newProps)) {
        hostPatchProp(el, k, null, oldProps[k]);
      }
    }
  }

  function processComponent(n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }
  // 元素挂载流程: 创建dom -> 初始化props、事件，-> 递归子元素
  function mountElement(vnode: any, container: any, parentComponent) {
    const { type, props, children, shapFlag } = vnode;
    const el: HTMLElement = (vnode.el = hostCreateElement(type)); // 处理element vnode 有el属性
    for (let p in props) {
      const val = props[p];
      hostPatchProp(el, p, val, null);
      // const isOn = (k: string) => /^on[A-Z]/.test(k);
      // if (isOn(p)) {
      //   const eventName = p.slice(2).toLowerCase();
      //   el.addEventListener(eventName, val);
      // } else {
      //   el.setAttribute(p, props[p]);
      // }
    }
    if (shapFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent);
    }
    hostInsert(el, container);
  }
  function mountChildren(children: any, el: HTMLElement, parentComponent) {
    children.forEach((v) => {
      patch(null, v, el, parentComponent);
    });
  }

  // 组件挂载 流程 创建组件实例 -> 调用setup (初始化 props ,slots, 并设置render 方法) -> 处理子元素 (调用组件render方法得到vnode, patch vnode得到真实dom, 并赋值给instance.vnode.el)
  function mountComponent(vnode: any, container: any, parentComponent) {
    // 创建组件实例
    const instance = createComponentInstance(vnode, parentComponent);
    // 设置组件setup
    setupComponent(instance);

    // 处理子节点
    // 只有组件才有更新机制
    setupRenderEffect(instance, container);
  }

  function setupRenderEffect(instance: any, container: any) {
    // 在处理子元素之前需要注册 effect 副作用函数， 将activeEffect 置成当前组件的更新函数，在处理子元素时，触发响应式对象的get时，会将 activeEffect 与响应式对象 通过targetMaps 形成联系，当响应式变量发生变化时，可以通过targetMap 拿到组件更新函数，从而执行更新
    // 现在要做的就是写好更新函数就可以了
    effect(() => {
      if (!instance.isMounted) {
        // 首次挂载
        // 这里保存一下子树, 保存到instance.subTree上，下次更新时需要取出，做diff
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        // 首次挂载 n1 为null
        patch(null, subTree, container, instance);
        // subTree 子元素 这时的用例是一个element, 所以有el 属性， 赋值给组件实例
        instance.vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // 更新流程
        const preSubTree = instance.subTree; // 获取更新前的vnode
        // 重新调用render 获取新的vnode
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        patch(preSubTree, subTree, container, instance);
        instance.vnode.el = subTree.el;
      }
    });
  }

  // 所以这里需要返回一个带有createApp 方法的对象
  // 这里的createApp 方法，其实就是原先的createApp 方法
  // 调用createAppAPI,将render 传入， 获得原先的createApp方法
  return {
    createApp: createAppAPI(render),
  };
}
