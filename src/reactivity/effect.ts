let activeEffect;
export const effect = (fn, options = {}) => {
  const _eff = new ReactiveEffect(fn, options);
  _eff.run();
  return _eff.run.bind(_eff);
};
export const stop = (runner) => {
  // targetMap 清除依赖
  runner(true);
};

class ReactiveEffect {
  private _fn: any;
  scheduler: any;
  deps: any[] = [];
  onStop: any;
  active = true;
  constructor(fn: any, { scheduler, onStop }: any) {
    this._fn = fn;
    this.scheduler = scheduler;
    this.onStop = onStop;
  }
  stop() {
    this.deps.forEach((dep) => {
      dep.delete(this);
    });
    this.active = false;
  }
  run(stop = false) {
    if (stop) {
      this.stop();
      this.onStop && this.onStop();
      return;
    }
    activeEffect = this;
    return this._fn();
  }
}

const targetMaps = new WeakMap();
export function track(target, key) {
  if (!activeEffect.active) return;
  if (!targetMaps.get(target)) {
    targetMaps.set(target, new Map());
  }
  const map = targetMaps.get(target);
  if (!map.get(key)) {
    map.set(key, new Set());
  }
  const deps = map.get(key);
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}
export function trigger(target, key) {
  const deps = targetMaps.get(target).get(key);
  for (let dp of deps) {
    if (dp.scheduler) {
      dp.scheduler();
    } else {
      dp.run();
    }
  }
}
