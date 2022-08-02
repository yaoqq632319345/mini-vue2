import { ReactiveEffect } from './effect';

export function computed(fn: any): any {
  return new ComputedImpl(fn);
}
class ComputedImpl {
  private _effect;
  private _value;
  private _dirty = true; // 记录一个值来确定什么时候更新
  constructor(fn) {
    this._effect = new ReactiveEffect(fn, {
      scheduler: () => (this._dirty = true),
    });
  }
  get value() {
    if (this._dirty) {
      this._value = this._effect.run();
      this._dirty = false;
    }
    return this._value;
  }
}
