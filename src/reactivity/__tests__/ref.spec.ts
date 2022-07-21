import { effect } from '../effect';
import { ref } from '../ref';
describe('ref', () => {
  it('ref', () => {
    const count = ref(1);
    expect(count.value).toBe(1);
    count.value++;
    expect(count.value).toBe(2);
  });
  it.only('ref effect', () => {
    const count = ref(1);
    let dummy;
    effect(() => {
      dummy = count.value;
    });
    expect(dummy).toBe(1);
    count.value++;
    expect(dummy).toBe(2);
  });
});