import { createRenderer } from '../runtime-core/renderer';

export * from '../runtime-core';
function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, k, val) {
  const isOn = (k: string) => /^on[A-Z]/.test(k);
  if (isOn(k)) {
    // 代表事件
    const event = k.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else {
    el.setAttribute(k, val);
  }
}
function insert(el, parent) {
  parent.append(el);
}
function createTextNode(text) {
  return document.createTextNode(text);
}

const renderer = createRenderer({
  createElement,
  patchProp,
  insert,
  createTextNode,
});

// 原先对外暴露的方法，改到了这里，这里其实调的createRenderer 返回对象中的createApp方法
export function createApp(args, ...other) {
  return renderer.createApp(args, ...other);
}
