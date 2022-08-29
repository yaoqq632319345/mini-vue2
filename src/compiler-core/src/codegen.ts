export const generate = (ast) => {
  const context = createCodegenContext();
  const { push } = context;

  // 1.
  // const { toDisplayString:_toDisplayString } = Vue
  genFunctionPreamble(ast, context);

  push('return ');

  const functionName = 'render';

  const args = ['_ctx', '_cache'];
  const signature = args.join(', ');

  push(`function ${functionName}(${signature}){ `);
  push('return ');
  genNode(ast.codegenNode, context);
  push('; }');
  return {
    code: context.code,
  };
};

// 1--- 接下来对ast进行处理，添加helpers
function genFunctionPreamble(ast: any, context) {
  const { push } = context;
  const VueBinging = 'Vue';
  const aliasHelper = (s) => `${s}: _${s}`;
  push(`
    const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}
  `);
  push('\n');
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source;
    },
  };

  return context;
}
function genNode(node: any, context) {
  const { push } = context;
  push(`'${node.content}'`);
}
