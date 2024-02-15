import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import DockviewPlugin from 'dockview-vue/main';

const app = createApp(App);

app.use(DockviewPlugin);

app.mount('#app');
