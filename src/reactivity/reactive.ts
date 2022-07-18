import { reactiveHandler, ReactiveMap, readonlyHandler } from './handler';

export const reactive = (raw: any) => {
  return new Proxy(raw, reactiveHandler);
};
export const readonly = (raw: any) => {
  return new Proxy(raw, readonlyHandler);
};
export const isReadonly = (raw: any) => {
  return raw[ReactiveMap.ISREADONLY] || false;
};
export const isReactive = (raw: any) => {
  return raw[ReactiveMap.ISREACTIVE] || false;
};
