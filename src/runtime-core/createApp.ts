import { createVNode } from './vnode';
// 这里对原先方法createApp包装，返回原先的createApp方法，就可以拿到render,
export function createAppAPI(render) {
  return (rootComponent) => {
    return {
      mount(rootContainer) {
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}
