import { transform } from '../src/transform';
import { baseParse } from '../src/parse';
import { generate } from '../src/codegen';
import { transformExpression } from '../src/transforms/transformExpression';
import { transformElement } from '../src/transforms/transformElement';
import { transformText } from '../src/transforms/transformText';
// npm run test codegen -- -u
// codegen: 测试文件名
// -- 跳过npm 参数
// -u 更新快照
describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi');
    transform(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
  it('{{message}}', () => {
    const ast = baseParse('{{message}}');
    transform(ast, {
      nodeTransforms: [transformExpression],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
  it('<div>hi,{{message}}</div>', () => {
    const ast = baseParse('<div>hi,{{message}}</div>');
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
  it('<div><p>hi,</p>{{message}}</div>', () => {
    const ast = baseParse('<div><p>hi,</p>{{message}}</div>');
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
