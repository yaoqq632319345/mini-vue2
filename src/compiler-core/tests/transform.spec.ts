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
    transform(ast);
    const nodeText = ast.children[0].children[0];
    expect(nodeText.content).toBe('hi,mini-vue');
  });
});
