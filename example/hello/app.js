import { h } from '../../lib/guide.mini-vue.esm.js';
export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'h100'],
      },
      [h('p', {}, 'hello'), h('p', {}, 'mini-vue')]
    );
  },
  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
