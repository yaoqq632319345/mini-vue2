import { trackEffect, triggerEffect } from './effect';

export const ref = (val: any) => new Ref(val);

class Ref {
  private __value: any;
  private deps: any = new Set();
  constructor(val: any) {
    this.__value = val;
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
    /***
     * TODO trigger
     * 遍历 this.deps
     */
    this.__value = newVal;
    triggerEffect(this.deps);
  }
}
