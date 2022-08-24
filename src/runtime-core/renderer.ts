import { effect } from './../reactivity/effect';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';
import { EMPTY_OBJ } from '../shared/shared';
import { shouldUpdateComponent } from './componentUpdateUtils';
import { queueJob } from './scheduler';
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
    patch(null, vnode, rootContainer, null, null);
  }

  // n1代表old vnode
  function patch(n1, n2, rootContainer: any, parentComponent, anchor) {
    const { shapFlag, type } = n2;
    // 增加两个类型的处理逻辑
    switch (type) {
      case Fragment:
        processFragment(n1, n2, rootContainer, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, rootContainer, anchor);
        break;
      default:
        if (shapFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, rootContainer, parentComponent, anchor);
        } else if (shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, rootContainer, parentComponent, anchor);
        }
    }
  }
  // 直接挂载子元素
  function processFragment(
    n1,
    n2,
    rootContainer: any,
    parentComponent,
    anchor
  ) {
    const { children } = n2;
    mountChildren(children, rootContainer, parentComponent, anchor);
  }
  // text 类型直接创建textnode 并插入
  function processText(n1, n2: any, rootContainer: any, anchor) {
    const { children } = n2;
    const textNode = (n2.el = hostCreateTextNode(children));
    hostInsert(textNode, rootContainer, anchor);
  }
  function processElement(
    n1,
    n2: any,
    rootContainer: any,
    parentComponent,
    anchor
  ) {
    if (!n1) {
      // 如果n1 不存在，挂载流程
      mountElement(n2, rootContainer, parentComponent, anchor);
    } else {
      patchElement(n1, n2, rootContainer, parentComponent, anchor);
    }
  }
  function patchElement(n1, n2, container, parentComponent, anchor) {
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(n1, n2, container, parentComponent, anchor) {
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
        mountChildren(c2, container, parentComponent, anchor);
      } /* 老节点也是array */ else {
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
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
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    // 右侧diff, e1--, e2--, node 取 c[e] , 但不能超过i
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1],
        n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // 旧的没了
    if (i > e1) {
      // 新的还有
      if (i <= e2) {
        // 需要创建
        // 这种情况时e2 已经不是最后一个了，所以e2 + 1 必定小于 l2(长度) 需要往 c2[e2 + 1].el insertBefore
        // 只有这里patch -> processElement -> mountElement -> hostInsert的时候需要一个anchor
        const anchor = e2 + 1 < l2 ? c2[e2 + 1].el : null;
        while (i <= e2) {
          const n2 = c2[i++];
          patch(null, n2, container, parentComponent, anchor);
        }
      }
    }
    // 新的没了
    else if (i > e2) {
      // 旧的还有
      if (i <= e1) {
        while (i <= e1) {
          hostRemove(c1[i++].el);
        }
      }
    }
    // 新旧都还有, 但是不一样
    else {
      let s1 = i, // c1 起点
        s2 = i; // c2 起点
      const toBePatched = e2 - s2 + 1; // 新数组剩下的个数
      const newIndexToOldIndexMap = new Array(toBePatched).fill(-1);
      // 遍历剩下的新节点 i ----> e2 建立映射
      const keyToNewIndexMap = new Map();
      for (let j = i; j <= e2; j++) {
        keyToNewIndexMap.set(c2[j].key, j);
      }
      // 遍历剩下的老节点 i ----> e1 看看新的映射里有没有，如果有，代表还存在，需要保留，如果没有则直接删除
      for (let j = i; j <= e1; j++) {
        const n1 = c1[j];
        if (keyToNewIndexMap.size === 0) {
          hostRemove(n1.el);
          continue;
        }
        const oldKey = n1.key;
        const newIndex = keyToNewIndexMap.get(oldKey);
        if (newIndex && isSameVNodeType(n1, c2[newIndex])) {
          // 在映射里虽然找到了，但是位置不对，需要做一下映射
          newIndexToOldIndexMap[newIndex - s2 /* 新坐标需要减去起点 */] =
            j /* 在老节点的位置 */;
          keyToNewIndexMap.delete(oldKey);
          // patch 完了之后， 赋予新旧vnode.el 属性为同一个dom元素
          patch(n1, c2[newIndex], container, parentComponent, parentAnchor);
        } else {
          hostRemove(n1.el);
        }
      }
      // 删除完了，只剩新增和移动
      // 得到的数组中不是-1的，即为在旧节点中可以找到，可以复用
      console.log(
        '新旧对比数组，不为-1的，说明可以在旧节点中找到，可以复用，最长递增子序列，是说明新旧对比相对位置也不变，不需要移动，其他的需要移动或添加的找到自己的位置插入即可',
        newIndexToOldIndexMap
      );
      const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
      // 遍历未处理的新节点, 需要使用insertBefore, 所以从右往左遍历
      for (let j = toBePatched - 1; j >= 0; j--) {
        // 实际坐标需要加上s2, 从s2 开始算的
        const nextIndex = j + s2;
        const nextChild = c2[nextIndex];

        // insertBefore 参考元素 = nextIndex + 1 是不是最后一个 ? null : c2[nextIndex + 1].el
        const anchor = nextIndex + 1 > l2 ? null : c2[nextIndex + 1].el;
        if (newIndexToOldIndexMap[j] === -1) {
          // 等于-1的，是新节点在老节点里不存在，需要新增
          patch(null, nextChild, container, parentComponent, anchor);
        } else if (increasingNewIndexSequence.includes(j)) {
          // 新节点在老节点存在， 并且属于最长递增子序列， 什么也不干
        } else {
          // 不属于最长递增子序列，但老节点里有，只需要移动
          // 这里nextChild.el 和 旧节点的el 是同一个，移动即可
          hostInsert(nextChild.el, container, anchor);
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

  function processComponent(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    if (n1) {
      // 如果n1 有值， 更新流程
      updateComponent(n1, n2, container, parentComponent, anchor);
    } else {
      mountComponent(n2, container, parentComponent, anchor);
    }
  }

  function updateComponent(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    // 1.这里更新组件需要得到effect 返回的runner
    // 3.想办法拿到组件实例，可以在创建组件实例时，保存在vnode 上
    // n1 经历过createComponentInstance 所以有，n2 是新的，需要赋值
    const instance = (n2.component = n1.component);
    if (shouldUpdateComponent(n1, n2)) {
      // 更新时需要n2,需要考虑如何代入, 这里把新的vnode放入实例中
      instance.n2 = n2;
      instance.update();
    } else {
      // 不需要更新则将n1的el 赋给n2, 将组件的vnode 更新成n2, n1就没了
      n2.el = n1.el;
      instance.vnode = n2;
    }
  }
  // 元素挂载流程: 创建dom -> 初始化props、事件，-> 递归子元素
  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    const { type, props, children, shapFlag } = vnode;
    const el: HTMLElement = (vnode.el = hostCreateElement(type)); // 处理element vnode 有el属性
    for (let p in props) {
      const val = props[p];
      hostPatchProp(el, p, val, null);
    }
    if (shapFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent, anchor);
    }
    hostInsert(el, container, anchor);
  }
  function mountChildren(
    children: any,
    el: HTMLElement,
    parentComponent,
    anchor
  ) {
    children.forEach((v) => {
      patch(null, v, el, parentComponent, anchor);
    });
  }

  // 组件挂载 流程 创建组件实例 -> 调用setup (初始化 props ,slots, 并设置render 方法) -> 处理子元素 (调用组件render方法得到vnode, patch vnode得到真实dom, 并赋值给instance.vnode.el)
  function mountComponent(vnode: any, container: any, parentComponent, anchor) {
    // 创建组件实例

    const instance = /* 第3步 */ (vnode.component = createComponentInstance(
      vnode,
      parentComponent
    ));
    // 设置组件setup
    setupComponent(instance);

    // 处理子节点
    // 只有组件才有更新机制
    setupRenderEffect(instance, container, anchor);
  }

  function setupRenderEffect(instance: any, container: any, anchor) {
    // 在处理子元素之前需要注册 effect 副作用函数， 将activeEffect 置成当前组件的更新函数，在处理子元素时，触发响应式对象的get时，会将 activeEffect 与响应式对象 通过targetMaps 形成联系，当响应式变量发生变化时，可以通过targetMap 拿到组件更新函数，从而执行更新
    // 现在要做的就是写好更新函数就可以了
    // 2. 这里把runner 保存在组件实例上
    instance.update = effect(
      () => {
        if (!instance.isMounted) {
          // 首次挂载
          // 这里保存一下子树, 保存到instance.subTree上，下次更新时需要取出，做diff
          const subTree = (instance.subTree = instance.render.call(
            instance.proxy
          ));
          // 首次挂载 n1 为null
          patch(null, subTree, container, instance, anchor);
          // subTree 子元素 这时的用例是一个element, 所以有el 属性， 赋值给组件实例
          instance.vnode.el = subTree.el;
          instance.isMounted = true;
        } else {
          const { n2 } = instance;
          if (n2) {
            // 如果新的vnode有值 , 更新组件 props， 更新完之后才能重新调用render
            updateComponentPreRender(instance, n2);
          }
          // 更新流程
          const preSubTree = instance.subTree; // 获取更新前的vnode
          // 重新调用render 获取新的vnode
          const subTree = (instance.subTree = instance.render.call(
            instance.proxy
          ));
          console.log('更新100次');
          patch(preSubTree, subTree, container, instance, anchor);
          instance.vnode.el = subTree.el;
        }
      },
      {
        // effect的功能，配置了scheduler,当响应式数据发生变化时，会将更新函数放入异步队列中，等待执行
        scheduler() {
          queueJob(instance.update);
        },
      }
    );
  }

  function updateComponentPreRender(instance: any, n2: any) {
    // 更新组件vnode n1 -> n2
    instance.vnode = n2;
    // n2 置空
    instance.n2 = null;
    // 更新组件实例props,视图使用
    instance.props = n2.props;
  }

  // 所以这里需要返回一个带有createApp 方法的对象
  // 这里的createApp 方法，其实就是原先的createApp 方法
  // 调用createAppAPI,将render 传入， 获得原先的createApp方法
  return {
    createApp: createAppAPI(render),
  };
}

// 最长递增子序列
function getSequence(nums) {
  let len = nums.length;
  let arr = [0];
  let pre: any[] = [];
  for (let i = 1; i < len; i++) {
    const ln = arr.length;
    if (nums[i] > nums[arr[ln - 1]]) {
      pre[i] = arr[ln - 1];
      arr.push(i);
      continue;
    }
    let l = 0,
      r = ln - 1;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (nums[arr[mid]] >= nums[i]) {
        r = mid;
      } else {
        l = mid + 1;
      }
    }
    pre[i] = arr[l - 1];
    arr[l] = i;
  }
  let a = arr.length,
    prev = arr[a - 1];
  while (a--) {
    arr[a] = prev;
    prev = pre[prev];
  }
  return arr;
}
