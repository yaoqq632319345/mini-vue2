import { readonly } from '../reactive';

describe('readonly', () => {
  it('readonly', () => {
    const origin = { foo: 1, bar: 2 };
    const wrap = readonly(origin);
    expect(wrap).not.toBe(origin);
    expect(wrap.foo).toBe(1);
    expect(wrap.bar).toBe(2);
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
});
