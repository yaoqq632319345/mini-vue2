import { createRenderer, h } from '../../lib/guide.mini-vue.esm.js';
console.log(PIXI);
const App = {
  setup() {
    return {
      x: 89,
      y: 100,
    };
  },
  render() {
    return h('rect', { x: this.x, y: this.y });
  },
};
const game = new PIXI.Application({
  width: 500,
  height: 500,
});
console.log('🚀 ====== file: man.js ====== line 8 ====== game', game);
document.body.append(game.view);
const render = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      return rect;
    }
  },
  patchProp(el, k, v) {
    console.log(el);
    el[k] = v;
  },
  insert(el, parent) {
    parent.addChild(el);
  },
});
console.log('🚀 ====== file: man.js ====== line 28 ====== render', render);
render.createApp(App).mount(game.stage);
