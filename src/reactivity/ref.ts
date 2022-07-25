import { reactive } from './reactive';
import { trackEffect, triggerEffect } from './effect';

export const ref = (val: any) => new Ref(val);
export const hasChange = (val, newValue) => !Object.is(val, newValue);
export const isObject = (val: any) => val !== null && typeof val === 'object';
class Ref {
  private __value: any;
  private deps: any = new Set();
  constructor(val: any) {
    if (isObject(val)) {
      this.__value = reactive(val);
    } else {
      this.__value = val;
    }
  }
  get value() {
    /***
     * TODO track
     * 将activeEffect 放入 this.deps中
     */
    trackEffect(this.deps);
    return this.__value;
  }
  set value(newVal) {
    if (!hasChange(newVal, this.__value)) return;
    /***
     * TODO trigger
     * 遍历 this.deps
     */
    this.__value = newVal;
    triggerEffect(this.deps);
  }
}
