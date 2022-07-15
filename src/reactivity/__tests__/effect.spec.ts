import { effect, stop } from '../effect';
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
  it('scheduler', () => {
    let dummy: any, run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
  it('stop', () => {
    let dummy: any;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => (dummy = obj.foo));
    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.foo = 3;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });
  it('onStop', () => {
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn();
    let dummy: any;
    const runner = effect(() => (dummy = obj.foo), { onStop });
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
