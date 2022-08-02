import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed', () => {
  it('computed', () => {
    const obj = reactive({
      foo: 100,
    });
    const c = computed(() => obj.foo);
    expect(c.value).toBe(100);
  });
  it('lazy computed', () => {
    const obj = reactive({
      foo: 100,
    });
    const getter = jest.fn(() => obj.foo);
    const c = computed(getter);
    // 不取值不调用
    expect(getter).not.toHaveBeenCalled();
    // 取一次调一次
    expect(c.value).toBe(100);
    expect(getter).toHaveBeenCalledTimes(1);
    // 值没变再取不该调
    c.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // 更新依赖值
    obj.foo = 1000;
    expect(getter).toHaveBeenCalledTimes(1);

    // 再次调用，次数加一
    expect(c.value).toBe(1000);
    expect(getter).toHaveBeenCalledTimes(2);

    // 值没变再次数还是2
    c.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
