import { isString } from './../../shared/shared';
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING,
} from './runtimeHelpers';
import { NodeTypes } from './ast';

export const generate = (ast) => {
  const context = createCodegenContext();
  const { push } = context;

  // 1.
  // const { toDisplayString:_toDisplayString } = Vue
  if (ast.helpers.length) {
    genFunctionPreamble(ast, context);
  }

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
  const { push, helper } = context;
  const VueBinging = 'Vue';
  const aliasHelper = (s) => `${helperMapName[s]}: ${helper(s)}`;
  push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`);
  push('\n');
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`;
    },
  };

  return context;
}
function genNode(node: any, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeTypes.ELEMENT:
      genElement(node, context);
      break;
    default:
      break;
  }
}

function genElement(node: any, context: any) {
  const { push, helper } = context;
  const { tag, children, props } = node;
  push(`${helper(CREATE_ELEMENT_VNODE)}(`);
  // 处理子元素
  push(`'${tag}', `);
  push(`${props || null}, `);
  genNodeList(children, context);
  push(')');
}

function genNodeList(nodeList: any, context: any) {
  const { push } = context;
  if (Array.isArray(nodeList)) {
    nodeList.forEach((node, i) => {
      if (i !== 0) {
        push(' + ');
      }
      genNode(node, context);
    });
  } else {
    genNode(nodeList, context);
  }
}

function genExpression(node: any, context: any) {
  const { push } = context;
  push(`${node.content}`);
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}

function genText(node: any, context: any) {
  const { push } = context;
  push(`'${node.content}'`);
}
