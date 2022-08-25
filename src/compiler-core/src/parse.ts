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
  return nodes;
}

function parseText(context: ctx) {
  const content = parseTextData(context, context.source.length);
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
  const element = parseTag(context, TagType.Start);
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
