import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from '../../lib/guide.mini-vue.esm.js';
export const App = {
  name: 'App',
  setup() {
    const count = ref(1);
    const _this = getCurrentInstance();
    const changeCount = () => {
      for (let i = 0; i < 100; i++) {
        count.value++;
        nextTick(() => {
          // 会放入异步队列中100次
          console.log(_this.vnode.el.innerHTML);
        });
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
