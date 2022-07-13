import { track, trigger } from './effect';

export const reactive = (raw: any) => {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      track(target, key);
      return res;
    },
    set(target, key, val) {
      const res = Reflect.set(target, key, val);
      trigger(target, key);
      return res;
    },
  });
};
