import { ShapeFlags } from '../shared/ShapeFlags';

export const initSlots = (instance, slots) => {
  const { vnode } = instance;
  if (vnode.shapFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(instance, slots);
  }
};
function normalizeObjectSlots(instance: any, slots: any) {
  for (let k in slots) {
    const val = slots[k];
    instance.slots[k] = (props) => normalizeSlotValue(val(props));
  }
}
function normalizeSlotValue(val: any) {
  return Array.isArray(val) ? val : [val];
}
