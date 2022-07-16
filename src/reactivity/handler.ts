import { track, trigger } from './effect';

const creatGetter = (readonly: boolean = false) => {
  return (target, key) => {
    const res = Reflect.get(target, key);
    if (!readonly) track(target, key);
    return res;
  };
};
const createSetter = (readonly: boolean = false) => {
  return (target, key, val) => {
    if (readonly) {
      console.warn('readonly can not set');
      return true;
    }
    const res = Reflect.set(target, key, val);
    trigger(target, key);
    return res;
  };
};
export const reactiveHandler = {
  get: creatGetter(),
  set: createSetter(),
};

export const readonlyHandler = {
  get: creatGetter(true),
  set: createSetter(true),
};
