export const createVNode = (type, props?, children?) => {
  const vnode = {
    // type: string时，为tag， obj时，为组件配置对象
    type,
    props,
    children,
  };
  return vnode;
};
