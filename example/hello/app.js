import { h } from '../../lib/guide.mini-vue.esm.js';
const Foo = {
  setup(props) {
    console.log(props);
    props.count.bar++;
    console.log(props);
  },
  render() {
    return h('h1', {}, `foo:${this.count.bar}`);
  },
};
window.root = null;
export const App = {
  render() {
    root = this;
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'h100'],
        onClick() {
          console.log('click');
        },
      },
      [h('p', {}, `${this.msg}, hello`), h(Foo, { count: { bar: 1 } })]
      // 'hi,' + this.msg
    );
  },
  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
