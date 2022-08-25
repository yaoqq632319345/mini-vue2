import { NodeTypes } from './ast';

type ctx = {
  source: string;
};
const enum TagType {
  Start,
  End,
}
// 1
export const baseParse = (content: string) => {
  const context = createParseContext(content);

  return createRoot(parseChildren(context));
};

// 4
function parseChildren(context: ctx) {
  const nodes: any[] = [];
  // while (context.source) { // 这里不能直接这么写，因为处理子节点时，还有闭合标签</div>
  while (!isEnd(context)) {
  let node;
  const s = context.source;
  if (s.startsWith('{{')) {
    node = parseInterpolation(context);
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  }

  if (!node) {
    node = parseText(context);
  }
  nodes.push(node);
  }
  return nodes;
}

function isEnd(context: ctx) {
  const s = context.source;
  if (s.startsWith('</') || !s) return true 
  return false
}

function parseText(context: ctx) {
  // 2. 递归处理子节点时，需要判断结束
  let endIndex = context.source.length;
  const endTokens = ['<', '{{'];
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index > -1 && endIndex > index) {
      endIndex = index;
    }
  }
  const content = parseTextData(context, endIndex);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context: ctx, length: number) {
  const content = context.source.slice(0, length);
  // console.log(context.source); // some text
  advanceBy(context, length);
  // console.log(context.source); //  ''
  return content;
}

function parseElement(context: ctx) {
  // 处理开始
  const element: any = parseTag(context, TagType.Start);
  // 1. 开始标签处理完毕 递归处理子节点
  element.children = parseChildren(context);
  console.log(element.children);

  // 处理结束
  parseTag(context, TagType.End);
  return element;
}

function parseTag(context: ctx, type: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  // console.log(match); /* match: [ '<div', 'div', ...] */
  const tag = match[1];

  // console.log(context.source); // <div></div>
  advanceBy(context, match[0].length);
  // console.log(context.source); //  ></div>
  // TODO parse props
  advanceBy(context, 1);
  // console.log(context.source); //  </div>

  if (type === TagType.End) return;

  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
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
  // 这里优化一下，处理完之后 context.source = }}
  const rawContent = parseTextData(context, rawContentLength);
  const content = rawContent.trim();

  // console.log(context.source); // }}
  advanceBy(context, closeDelimiter.length);
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
