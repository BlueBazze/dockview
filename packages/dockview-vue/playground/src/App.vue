<script setup lang="ts">
import type {
    IDockviewPanelProps,
    PanelCollection,
    DockviewReadyEvent,
} from 'dockview-vue';
import TextPanel from './components/panels/TextPanel.vue';
import { shallowRef } from 'vue';

const components = shallowRef<PanelCollection<IDockviewPanelProps>>({
    editor: TextPanel,
});

function onReady(event: DockviewReadyEvent) {
    console.log('onReady', event);
    event.api.addPanel({ id: 'Tab1', component: 'editor', title: 'Tab 1' });
    event.api.addPanel({ id: 'Tab2', component: 'editor', title: 'Tab 2' });
    event.api.addPanel({ id: 'Tab3', component: 'editor', title: 'Tab 3' });
}
</script>

<template>
    <div style="display: flex; flex: 1; width: 100%">
        <!-- <Editor> </Editor> -->
        <!-- <MonacoEditor /> -->

        <dv-dockview
            :components="components"
            @onReady="onReady"
            class="dockview-theme-dark"
        />
        <!-- <DockView></DockView> -->
    </div>
</template>

<style>
@import 'dockview-core/dist/styles/dockview.css';
.dockview-vue-part {
    height: 100%;
    width: 100%;
}
</style>
