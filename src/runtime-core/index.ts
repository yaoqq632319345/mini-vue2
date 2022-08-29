export { h } from './h';
export { renderSlots } from './helpers/renderSlots';
// 2. 解决调用render函数调用 createElementVNode 方法不存在
export { createTextVNode, createElementVNode } from './vnode';
export { getCurrentInstance, registerRuntimeCompiler } from './component';
export { provide, inject } from './apiInject';
export { createRenderer } from './renderer';
export { nextTick } from './scheduler';
// 3. 解决调用render函数调用 toDisplayString 方法不存在
export * from '../shared/toDisplayString';
