import { isReactive, reactive } from './../reactive';
describe('reactive', () => {
  it('reactive obj', () => {
    const obj = {
      a: { a: 1 },
      b: { b: { b: 2 } },
      c: [{ c: 3 }],
    };
    const reac_obj = reactive(obj);
    expect(isReactive(reac_obj.a)).toBe(true);
    expect(isReactive(reac_obj.b.b)).toBe(true);
    expect(reac_obj.b.b.b).toBe(2);
    expect(reac_obj.c[0].c).toBe(3);
  });
  it('reactive smple val', () => {
    console.warn = jest.fn();
    const count = reactive(100);
    expect(count).toBe(100);
    expect(console.warn).toBeCalled();
  });
});
