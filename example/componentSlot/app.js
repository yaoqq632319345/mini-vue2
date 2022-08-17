import {
  h,
  renderSlots,
  createTextVNode,
} from '../../lib/guide.mini-vue.esm.js';
const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h('p', {}, 'foo');
    console.log(this.$slots);
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
      {},
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
    return {};
  },
};
