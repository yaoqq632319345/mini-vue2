import { transform } from '../src/transform';
import { baseParse } from '../src/parse';
import { generate } from '../src/codegen';
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
});
