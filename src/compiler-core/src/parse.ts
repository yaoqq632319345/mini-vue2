import { NodeTypes } from './ast';

type ctx = {
  source: string;
};
// 1
export const baseParse = (content: string) => {
  const context = createParseContext(content);

  return createRoot(parseChildren(context));
};

// 4
function parseChildren(context: ctx) {
  const nodes: any[] = [];
  let node;
  if (context.source.startsWith('{{')) {
    node = parseInterpolation(context);
  }
  nodes.push(node);
  return nodes;
}

// 5 处理 {{ message }}
function parseInterpolation(context: ctx) {
  const openDelimiter = '{{';
  const closeDelimiter = '}}';
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  // console.log(context.source);// {{ message }}
  advanceBy(context, openDelimiter.length);
  // console.log(context.source);//  message }}

  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();

  // console.log(context.source); //  message }}
  advanceBy(context, rawContentLength + closeDelimiter.length);
  // console.log(context.source); //  ''

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

// 3
function createRoot(children: any[]) {
  return {
    children,
  };
}

// 2
function createParseContext(content: string) {
  return {
    source: content,
  };
}

// 6
function advanceBy(context: ctx, length: number) {
  context.source = context.source.slice(length);
}
