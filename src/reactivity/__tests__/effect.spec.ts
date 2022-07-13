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
});
