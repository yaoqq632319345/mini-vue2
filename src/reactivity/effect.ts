let activeEffect;
export const effect = (fn) => {
  const _eff = new ReactiveEffect(fn);
  _eff.run();
  return _eff.run.bind(_eff);
};

class ReactiveEffect {
  private _fn: any;
  constructor(fn: any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}

const targetMaps = new WeakMap();
export function track(target, key) {
  if (!targetMaps.get(target)) {
    targetMaps.set(target, new Map());
  }
  const map = targetMaps.get(target);
  if (!map.get(key)) {
    map.set(key, new Set());
  }
  const deps = map.get(key);
  deps.add(activeEffect);
}
export function trigger(target, key) {
  const deps = targetMaps.get(target).get(key);
  for (let dp of deps) {
    dp.run();
  }
}
