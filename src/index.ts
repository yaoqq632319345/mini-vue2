export * from './runtime-dom';
export * from './reactivity';
import { baseCompiler } from './compiler-core/src';
import * as runtimeDom from './runtime-dom';

// 3. 注册编译器 compiler
import { registerRuntimeCompiler } from './runtime-dom';
function compileToFunction(template) {
  const { code } = baseCompiler(template);
  const renderFn = new Function('Vue', code)(
    /********** 
    function (Vue) {
      const { toDisplayString: _toDisplayString,  createElement: _createElement } = Vue
      return function render(_ctx, _cache) {
        return  _createElement("div", null, "hi," + _toDisplayString(_ctx.count))
      }
    }
    **********/
    runtimeDom
  );
  return renderFn;
}

registerRuntimeCompiler(compileToFunction);
