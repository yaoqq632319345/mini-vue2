// 2. 把parse transform generate 组装
import { generate } from './codegen';
import { baseParse } from './parse';
import { transform } from './transform';
import { transformElement } from './transforms/transformElement';
import { transformExpression } from './transforms/transformExpression';
import { transformText } from './transforms/transformText';
export function baseCompiler(template) {
  const ast = baseParse(template);
  transform(ast, {
    nodeTransforms: [
      // 1. 首先对表达式加工, {{xxx}} -> _ctx.xxx
      transformExpression,
      // 3. 最后对ele 加工, 将{ tag, props, children } 赋给 codegenNode
      transformElement,
      // 2. 其次对文本加工, hi,{{xxx}} -> 'hi,' + _ctx.xxx
      transformText,
    ],
  });
  return generate(ast);
}
