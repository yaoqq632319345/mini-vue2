import { h, ref } from '../../lib/guide.mini-vue.esm.js';
export const App = {
  render() {
    console.log(this.foo);
    return h(
      'div',
      {
        ...this.foo,
      },
      [
        h('p', {}, `hi,${this.count}`),
        h(
          'button',
          {
            onClick: this.onClick,
          },
          '点我加加'
        ),
        h(
          'button',
          {
            onClick: this.onDeleteProps,
          },
          '点我删除foo'
        ),
        h(
          'button',
          {
            onClick: this.onDeleteKey,
          },
          '点我删除bar'
        ),
        h(
          'button',
          {
            onClick: this.onChangeProps,
          },
          '点我改变foo'
        ),
      ]
    );
  },
  setup() {
    const count = ref(0);
    const foo = ref({
      foo: 'foo',
      bar: 'bar',
    });
    const onClick = () => {
      console.log('加加');
      count.value++;
    };
    const onChangeProps = () => {
      foo.value.foo = 'new-foo';
    };
    const onDeleteProps = () => {
      foo.value.foo = undefined;
    };
    const onDeleteKey = () => {
      foo.value = {
        foo: 'foo',
      };
    };
    return { count, onClick, foo, onChangeProps, onDeleteKey, onDeleteProps };
  },
};
