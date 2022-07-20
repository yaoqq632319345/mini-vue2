import { reactive } from './reactive';
import { track, trigger } from './effect';
export const enum ReactiveMap {
  ISREACTIVE = '__v__isReactive',
  ISREADONLY = '__v__isReadonly',
}
const isObject = (raw) => raw !== null && typeof raw === 'object';
const creatGetter = (readonly: boolean = false, shallow: boolean = false) => {
  return (target, key) => {
    if (key === ReactiveMap.ISREACTIVE) {
      return !readonly;
    } else if (key === ReactiveMap.ISREADONLY) {
      return readonly;
    }
    const res = Reflect.get(target, key);
    if (!readonly) track(target, key);
    if (isObject(res) && !shallow) {
      return reactive(res);
    }
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
const get = creatGetter();
const set = createSetter();
export const reactiveHandler = {
  get,
  set,
};
const readonlyGet = creatGetter(true);
const readonlySet = createSetter(true);
export const readonlyHandler = {
  get: readonlyGet,
  set: readonlySet,
};
const shallowReadonlyGet = creatGetter(true, true);
export const shallowReadonlyHanlder = {
  get: shallowReadonlyGet,
  set: readonlySet,
};
const shallowReactiveGet = creatGetter(false, true);
export const shallowReactiveHanlder = {
  get: shallowReactiveGet,
  set,
};
