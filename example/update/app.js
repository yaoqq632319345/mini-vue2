import { h, ref } from '../../lib/guide.mini-vue.esm.js';
export const App = {
  render() {
    return h('div', {}, [
      h('p', {}, `hi,${this.count}`),
      h(
        'button',
        {
          onClick: this.onClick,
        },
        '点我加加'
      ),
    ]);
  },
  setup() {
    const count = ref(0);
    const onClick = () => {
      console.log('加加');
      count.value++;
    };
    return { count, onClick };
  },
};
