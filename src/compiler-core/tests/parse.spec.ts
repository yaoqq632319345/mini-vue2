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
        children: [],
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
    test('<div>hi,{{message}}</div>', () => {
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
    test('<div><p>hi</p>{{message}}</div>', () => {
      const ast = baseParse('<div><p>hi</p>{{message}}</div>');

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: 'p',
            children: [
              {
                type: NodeTypes.TEXT,
                content: 'hi',
              },
            ],
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
    test('<div><span></div>', () => {
      expect(() => {
        baseParse('<div><span></div>');
      }).toThrow(`缺少结束标签:span`);
    });
  });
});
