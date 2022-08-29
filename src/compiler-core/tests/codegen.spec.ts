import { transform } from '../src/transform';
import { baseParse } from '../src/parse';
import { generate } from '../src/codegen';
import { transformExpression } from '../src/transforms/transformExpression';
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
    transform(ast, {});
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
