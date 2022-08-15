import { h } from '../../lib/guide.mini-vue.esm.js';
const Foo = {
  setup(props, { emit }) {
    const emitAdd = (arg) => {
      emit('add', 100, 1000);
      emit('add-foo', 200, 2000);
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd,
      },
      'emitAdd'
    );
    return h('div', {}, [btn]);
  },
};
window.root = null;
export const App = {
  render() {
    root = this;
    return h('div', {}, [
      h(Foo, {
        onAdd(a, b) {
          console.log('父组件事件onAdd', a, b);
        },
        onAddFoo(a, b) {
          console.log('父组件事件onAddFoo', a, b);
        },
      }),
    ]);
  },
  setup() {},
};
