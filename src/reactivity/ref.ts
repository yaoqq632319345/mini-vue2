import { reactive } from './reactive';
import { trackEffect, triggerEffect } from './effect';
import { isObject } from './shared';

export const ref = (val: any) => new Ref(val);
export const hasChange = (val, newValue) => !Object.is(val, newValue);
class Ref {
  private __value: any;
  private deps: any = new Set();
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
