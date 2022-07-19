import { reactive } from './reactive';
import { track, trigger } from './effect';
export const enum ReactiveMap {
  ISREACTIVE = '__v__isReactive',
  ISREADONLY = '__v__isReadonly',
}
const isObject = (raw) => raw !== null && typeof raw === 'object';
const creatGetter = (readonly: boolean = false) => {
  return (target, key) => {
    if (key === ReactiveMap.ISREACTIVE) {
      return !readonly;
    } else if (key === ReactiveMap.ISREADONLY) {
      return readonly;
    }
    const res = Reflect.get(target, key);
    if (!readonly) track(target, key);
    if (isObject(res)) return reactive(res);
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
