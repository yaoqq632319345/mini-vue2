export const isObject = (val: any) => val !== null && typeof val === 'object';
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);
