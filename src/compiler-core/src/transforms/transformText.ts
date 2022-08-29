import { NodeTypes } from '../ast';
import { isText } from '../utils';

export function transformText(node) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const { children } = node;

      let currentContainer;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (isText(child)) {
          // 如果是text 需要拼接， 则将需要拼接的child 拼成一个child
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              if (!currentContainer) {
                // 将children[i] 改成复合类型，并将自己放入自己的children 中
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                };
              }
              // 后续继续合并
              currentContainer.children.push(' + ');
              currentContainer.children.push(next);
              // 原先的children 移除
              children.splice(j, 1);
              j--;
            } else {
              currentContainer = undefined;
              break;
            }
          }
        }
      }
    };
  }
}
