import { NodeTypes } from '../src/ast';
import { baseParse } from '../src/parse';
import { transform } from '../src/transform';

describe('transform', () => {
  it('<div>hi,{{message}}</div>', () => {
    const ast = baseParse('<div>hi,{{message}}</div>');
    /**
     * ast: {
     *  children: [{
     *    type: element,
     *    tag: 'div',
     *    children: [{
     *      type: 'text',
     *      content: 'xx'
     *    }]
     *  }]
     * }
     */
    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content += 'mini-vue';
      }
    };
    transform(ast, {
      nodeTransforms: [plugin],
    });
    const nodeText = ast.children[0].children[0];
    expect(nodeText.content).toBe('hi,mini-vue');
  });
});
