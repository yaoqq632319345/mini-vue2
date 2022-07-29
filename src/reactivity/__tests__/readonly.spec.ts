import { isProxy, isReactive, isReadonly, readonly } from '../reactive';

describe('readonly', () => {
  it('readonly', () => {
    const origin = { foo: 1, bar: 2 };
    const wrap = readonly(origin);
    expect(wrap).not.toBe(origin);
    expect(wrap.foo).toBe(1);
    expect(wrap.bar).toBe(2);

    expect(isProxy(wrap)).toBe(true);
  });
  it('readonly set', () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 18,
    });
    user.age++;
    expect(user.age).toBe(18);
    expect(console.warn).toBeCalled();
  });
  it('isReadonly', () => {
    const ori = { b: 1 };
    const a = readonly(ori);
    expect(isReadonly(a)).toBe(true);
    expect(isReadonly(ori)).toBe(false);
    expect(isReactive(a)).toBe(false);
    expect(isReactive(ori)).toBe(false);
  });
});
