import type { App, FunctionPlugin, Plugin } from 'vue';

import DockviewVue from './components/Dockview.vue';

export * from './types/panel';
export * from './types/dockview';

export interface DockviewPluginOptions {}

const DockviewPlugins: Plugin = {
    install(app: App, options: DockviewPluginOptions = {}) {
        app.component('dv-dockview', () => import('./components/Dockview.vue'));
    },
};

export default function DockviewPlugin(
    app: App,
    options: DockviewPluginOptions = {}
) {
    app.component('dv-dockview', DockviewVue);
}

export { DockviewVue };
