import { effect } from '../effect';
import { ref } from '../ref';
describe('ref', () => {
  it('ref', () => {
    const count = ref(1);
    expect(count.value).toBe(1);
    count.value++;
    expect(count.value).toBe(2);
  });
});
