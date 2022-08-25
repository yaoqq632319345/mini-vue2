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
  describe('text', () => {
    it('some text', () => {
      const ast = baseParse('some text');
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: 'some text',
      });
    });
  });
  describe('联合类型', () => {
    test.only('hello world', () => {
      const ast = baseParse('<div>hi,{{message}}</div>');

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: [
          {
            type: NodeTypes.TEXT,
            content: 'hi,',
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: 'message',
            },
          },
        ],
      });
    });
  });
});
