import { createRenderer } from '../runtime-core/renderer';

export * from '../runtime-core';
function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, k, val, oldVal) {
  const isOn = (k: string) => /^on[A-Z]/.test(k);
  if (isOn(k)) {
    // 代表事件
    const event = k.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else {
    if (val === undefined || val === null) {
      el.removeAttribute(k);
    } else {
      el.setAttribute(k, val);
    }
  }
}
function insert(el, parent, anchor) {
  (parent as HTMLElement).insertBefore(el, anchor);
}
function createTextNode(text) {
  return document.createTextNode(text);
}

function remove(el: HTMLElement) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}
function setElementText(el: HTMLElement, text: string) {
  el.textContent = text;
}
const renderer = createRenderer({
  createElement,
  patchProp,
  insert,
  createTextNode,
  remove,
  setElementText,
});

// 原先对外暴露的方法，改到了这里，这里其实调的createRenderer 返回对象中的createApp方法
export function createApp(arg) {
  return renderer.createApp(arg);
}
