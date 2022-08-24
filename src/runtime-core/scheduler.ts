const p = Promise.resolve();
// nextTick 将参数转成微任务
export function nextTick(fn) {
  // ===================================
  // 组件更新函数第一个放入，之后是100次自己注册的nextTick
  console.log(fn);
  return fn ? p.then(fn) : p;
}

// 维护一个队列
const queue: any[] = [];
let isPending = false;
// 将组件更新函数入队，并尝试异步清空队列
export function queueJob(fn) {
  if (!queue.includes(fn)) {
    queue.push(fn);
  }
  queFlush();
}

export function queFlush() {
  if (isPending) return;
  isPending = true;
  nextTick(flushJobs);
}
// 清空队列
function flushJobs() {
  while (queue.length) {
    const job = queue.shift();
    job && job();
  }
  isPending = false;
}
