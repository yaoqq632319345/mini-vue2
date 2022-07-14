import { effect } from '../effect';
import { reactive } from '../reactive';

describe('effect', () => {
  it('effect', () => {
    const foo = reactive({
      bar: 1,
    });
    let bar;
    effect(() => {
      bar = foo.bar + 1;
    });
    expect(bar).toBe(2);
    foo.bar = 2;
    expect(bar).toBe(3);
  });
  it('effect run', () => {
    const foo = { foo: 10 };
    const runner = effect(() => {
      foo.foo++;
      return 'foo';
    });
    expect(foo.foo).toBe(11);
    const res = runner();
    console.log(res);

    expect(foo.foo).toBe(12);
    expect(res).toBe('foo');
  });
});
