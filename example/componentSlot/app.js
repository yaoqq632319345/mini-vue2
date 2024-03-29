import {
  h,
  renderSlots,
  createTextVNode,
  getCurrentInstance,
  inject,
  provide,
} from '../../lib/guide.mini-vue.esm.js';
const Foo = {
  setup() {
    const i = getCurrentInstance();
    // console.log(i.props);
    const foo = inject('foo');
    const bar = inject('bar', 'default---------------------------bar');
    console.log(foo, bar);
    return {};
  },
  render() {
    const foo = h('p', {}, 'foo');
    // console.log(this.$slots);
    // children -> vnode
    //
    // renderSlots
    // 具名插槽
    // 1. 获取到要渲染的元素 1
    // 2. 要获取到渲染的位置
    // 作用域插槽
    const age = 18;
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age,
      }),
      foo,
      renderSlots(this.$slots, 'footer'),
    ]);
  },
};
window.root = null;
export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App');
    const foo = h(
      Foo,
      { foo: 1 },
      {
        header: ({ age }) => [
          h('p', {}, 'header-age' + age),
          h('p', {}, 'header-p2'),
          createTextVNode('哈哈'),
        ],
        footer: () => h('p', {}, 'footer'),
      }
    );
    return h('div', {}, [app, foo]);
  },
  setup() {
    provide('foo', 'provide-foooooooooooooooooo');
    return {};
  },
};
