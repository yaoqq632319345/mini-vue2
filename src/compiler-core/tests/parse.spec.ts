import { NodeTypes } from '../src/ast';
import { baseParse } from '../src/parse';
describe('Parse', () => {
  describe('interpolation', () => {
    it('{{ message }}', () => {
      const ast = baseParse('{{ message }}');

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message',
        },
      });
    });
  });
  describe('element', () => {
    it('<div></div>', () => {
      const ast = baseParse('<div></div>');
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
      });
    });
  });
});
