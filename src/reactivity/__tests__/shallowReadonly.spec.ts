import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  it('shallowReadonly', () => {
    const ori = { a: { b: 1 } };
    const obj = shallowReadonly(ori);
    expect(isReadonly(obj)).toBe(true);
    expect(isReadonly(obj.a)).toBe(false);
  });
});
