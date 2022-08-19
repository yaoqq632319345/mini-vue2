import { getCurrentInstance } from './component';

export const provide = (key, val) => {
  const instance = getCurrentInstance();
  if (instance) {
    let { provides } = instance;
    const parent = instance.parent;
    if (parent) {
      const parentProvides = parent.provides;
      if (provides === parentProvides) {
        provides = instance.provides = Object.create(parentProvides);
      }
    }
    provides[key] = val;
  }
};
export const inject = (key, defaultVal) => {
  const instance = getCurrentInstance();
  if (instance) {
    const { provides } = instance;
    const val = provides[key];
    if (val) return val;
    return typeof defaultVal === 'function' ? defaultVal() : defaultVal;
  }
};
