import {
  shallowReadonlyHanlder,
  reactiveHandler,
  ReactiveMap,
  readonlyHandler,
  shallowReactiveHanlder,
} from './handler';
import { isObject } from '../shared/shared';

export const reactive = (raw: any) => {
  return createReativeObject(raw, reactiveHandler);
};

// 添加统一处理方法，所有响应式都不能创建单值
function createReativeObject(raw: any, handler: any) {
  if (isObject(raw)) {
    return new Proxy(raw, handler);
  } else {
    console.warn('reactive only obj');
    return raw;
  }
}

export const readonly = (raw: any) => {
  return createReativeObject(raw, readonlyHandler);
};
export const isReadonly = (raw: any) => {
  return !!raw[ReactiveMap.ISREADONLY];
};
export const isReactive = (raw: any) => {
  return !!raw[ReactiveMap.ISREACTIVE];
};
export const shallowReadonly = (raw: any) => {
  return createReativeObject(raw, shallowReadonlyHanlder);
};

export const shallowReactive = (raw: any) => {
  return createReativeObject(raw, shallowReactiveHanlder);
};

export const isProxy = (raw) => isReactive(raw) || isReadonly(raw);
