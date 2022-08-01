import { reactive } from './reactive';
import { trackEffect, triggerEffect } from './effect';
import { isObject } from './shared';

export const ref = (val: any) => new Ref(val);
export const hasChange = (val, newValue) => !Object.is(val, newValue);
class Ref {
  private __value: any;
  private deps: any = new Set();
  private __is_ref__ = true;
  constructor(val: any) {
    this.setVal(val);
  }
  private setVal(val: any) {
    if (isObject(val)) {
      this.__value = reactive(val);
    } else {
      this.__value = val;
    }
  }

  get value() {
    /***
     * 将activeEffect 放入 this.deps中
     */
    trackEffect(this.deps);
    return this.__value;
  }
  set value(newVal) {
    if (!hasChange(newVal, this.__value)) return;
    /***
     * 遍历 this.deps
     */
    this.setVal(newVal);
    triggerEffect(this.deps);
  }
}
export function isRef(val) {
  return !!val['__is_ref__'];
}

export function unRef(val) {
  if (isRef(val)) return val.value;
  return val;
}

export function proxyRefs(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, val) {
      const res = Reflect.get(target, key);
      if (isRef(res) && !isRef(val)) {
        return (target[key].value = val);
      }
      return Reflect.set(target, key, val);
    },
  });
}
