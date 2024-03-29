// 组件更新其实就是props发生了变化,需要更新视图
export const shouldUpdateComponent = (n1, n2) => {
  const { props: prevProps } = n1,
    { props: nextProps } = n2;
  for (const k in nextProps) {
    if (nextProps[k] !== prevProps[k]) return true;
  }
  return false;
};
