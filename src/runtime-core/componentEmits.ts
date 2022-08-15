import { camelize, toHandlerKey } from '../shared/shared';

export const emit = (instance, event, ...args) => {
  const { props } = instance;
  // event : add | add-foo
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
};
