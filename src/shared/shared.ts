export const isObject = (val: any) => val !== null && typeof val === 'object';
export const EMPTY_OBJ = Object.create(null);
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);
// add => Add
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
// Add => onAdd
export const toHandlerKey = (str: string): string => `on${capitalize(str)}`;
// add-foo => addFoo
export const camelize = (str: string): string => {
  // let res = '';
  // str
  //   .split('-')
  //   .forEach((item) => (res += item.charAt(0).toUpperCase() + item.slice(1)));
  // return res.charAt(0).toLowerCase() + res.slice(1);
  return str.replace(/-(\w)/g, (a, b: string) => {
    return b ? b.toUpperCase() : '';
  });
};
