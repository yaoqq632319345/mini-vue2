import { h, ref } from '../../lib/guide.mini-vue.esm.js';
export const App = {
  name: 'App',
  setup() {
    const count = ref(1);
    const changeCount = () => {
      for (let i = 0; i < 100; i++) {
        count.value++;
      }
    };
    return { changeCount, count };
  },
  render() {
    return h('div', {}, [
      h(
        'button',
        {
          onClick: this.changeCount,
        },
        '更新'
      ),
      h('p', {}, 'count: ' + this.count),
    ]);
  },
};
