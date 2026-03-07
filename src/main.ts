import process from 'process';

const runtimeGlobal = globalThis as typeof globalThis & {
  global?: typeof globalThis;
  process?: typeof process;
};

runtimeGlobal.process = process;
if (typeof runtimeGlobal.process.nextTick !== 'function') {
  runtimeGlobal.process.nextTick = ((callback: (...args: unknown[]) => void, ...args: unknown[]) => {
    queueMicrotask(() => callback(...args));
  }) as typeof process.nextTick;
}
runtimeGlobal.global = runtimeGlobal;

import { createApp } from 'vue';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import i18n from '@/i18n';
import App from '@/App.vue';

const app = createApp(App);
app.use(Antd);
app.use(i18n);
app.mount('#app');
