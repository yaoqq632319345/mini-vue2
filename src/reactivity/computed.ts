import { ReactiveEffect } from './effect';

export function computed(fn: any): any {
  return new ComputedImpl(fn);
}
class ComputedImpl {
  private _effect;
  private _value;
  constructor(fn) {
    this._effect = new ReactiveEffect(fn, {});
  }
  get value() {
    return (this._value = this._effect.run());
  }
}
