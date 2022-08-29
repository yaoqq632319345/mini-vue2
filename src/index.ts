export * from './runtime-dom';
export * from './reactivity';
import { baseCompiler } from './compiler-core/src';
import * as runtimeDom from './runtime-dom';

// 3. 注册编译器 compiler
import { registerRuntimeCompiler } from './runtime-dom';
function compileToFunction(template) {
  const { code } = baseCompiler(template);
  const codeFn = new Function('Vue', code);
  // console.log(codeFn);
  /********** 
  function anonymous(Vue) {
    const { toDisplayString: _toDisplayString, createElementVNode: _createElementVNode } = Vue
    return function render(_ctx, _cache){
      return _createElementVNode('div', null, 'hi,' + _toDisplayString(_ctx.count));
    }
  }
  **********/
  const renderFn = codeFn(runtimeDom);
  return renderFn;
}

registerRuntimeCompiler(compileToFunction);
