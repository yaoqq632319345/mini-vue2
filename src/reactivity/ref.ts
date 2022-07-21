export const ref = (val: any) => new Ref(val);

class Ref {
  private __value: any;
  constructor(val: any) {
    this.__value = val;
  }
  get value() {
    return this.__value;
  }
  set value(newVal) {
    this.__value = newVal;
  }
}
