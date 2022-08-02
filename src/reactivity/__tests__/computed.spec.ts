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
    const getter = () => obj.foo;
    const c = computed(getter);
  });
});
