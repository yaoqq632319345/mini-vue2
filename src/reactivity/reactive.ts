import {
  shallowReadonlyHanlder,
  reactiveHandler,
  ReactiveMap,
  readonlyHandler,
  shallowReactiveHanlder,
} from './handler';

export const reactive = (raw: any) => {
  return new Proxy(raw, reactiveHandler);
};
export const readonly = (raw: any) => {
  return new Proxy(raw, readonlyHandler);
};
export const isReadonly = (raw: any) => {
  return !!raw[ReactiveMap.ISREADONLY];
};
export const isReactive = (raw: any) => {
  return !!raw[ReactiveMap.ISREACTIVE];
};
export const shallowReadonly = (raw: any) => {
  return new Proxy(raw, shallowReadonlyHanlder);
};

export const shallowReactive = (raw: any) => {
  return new Proxy(raw, shallowReactiveHanlder);
};
