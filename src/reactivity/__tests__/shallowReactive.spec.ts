import { effect } from '../effect';
import { isReactive, shallowReactive } from '../reactive';
describe('shallowReactive', () => {
  it('shallowReactive', () => {
    const ori = { a: { b: 1 } };
    const obj = shallowReactive(ori);
    expect(isReactive(obj)).toBe(true);
    expect(isReactive(obj.a)).toBe(false);
    let dummy;
    const runner = effect(() => {
      dummy = obj.a.b;
    });
    expect(dummy).toBe(1);
    obj.a.b++;
    expect(dummy).toBe(1);
    obj.a = { b: 3111 };
    expect(dummy).toBe(3111);
  });
});
