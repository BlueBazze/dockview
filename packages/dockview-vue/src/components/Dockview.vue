<script lang="ts" setup>
import {
    DockviewApi,
    DockviewComponent,
    type GroupPanelFrameworkComponentFactory,
    type IContentRenderer,
} from 'dockview-core';
import 'dockview-core/dist/styles/dockview.css';
import { type VNodeRef, onMounted, onUnmounted, ref } from 'vue';
import type { DockviewReadyEvent, IDockviewVueProps } from '../types/dockview';
import DefaultTab from './defaults/defaultTab.vue';
import { VueWatermarkPart } from '../parts/vueWaterMarkPart';
import { VuePanelHeaderPart } from '../parts/vueHeaderPart';
import { VuePanelContentPart } from '../parts/vueContentPart';

const props = defineProps<IDockviewVueProps>();

const emit = defineEmits<{
    onReady: [event: DockviewReadyEvent];
}>();

const domRef = ref<VNodeRef>();
const api = ref<DockviewApi>();
const instance = ref<DockviewComponent>();
const observer = ref<ResizeObserver>();

const factory: GroupPanelFrameworkComponentFactory = {
    content: {
        createComponent(id, componentId, component): IContentRenderer {
            return new VuePanelContentPart(componentId, component);
        },
    },
    tab: {
        createComponent(id, componentId, component): IContentRenderer {
            return new VuePanelHeaderPart(componentId, component);
        },
    },
    watermark: {
        createComponent(id, componentId, component) {
            return new VueWatermarkPart(componentId, component);
        },
    },
};

onMounted(() => {
    const frameworkTabComponents = props.tabComponents ?? {
        default: DefaultTab,
    };

    if (props.tabComponents) {
        frameworkTabComponents['default'] = props.tabComponents['default'];
    }

    if (!domRef.value) {
        console.error('domRef is not defined');
        return;
    }

    instance.value = new DockviewComponent({
        parentElement: domRef.value as any,
        frameworkComponents: props.components,
        frameworkComponentFactory: factory,
        frameworkTabComponents,
        // watermarkFrameworkComponent: this.$props.watermarkComponent,
        defaultTabComponent: 'default',
        debug: true,
    });

    api.value = new DockviewApi(instance.value);

    emit('onReady', { api: api.value });

    observer.value = new ResizeObserver((entries) => {
        const firstEntry = entries[0];
        const { width, height } = firstEntry.contentRect;
        instance.value?.layout(width, height);
    });
    observer.value.observe(domRef.value as any);
});

onUnmounted(() => {
    if (instance.value) {
        instance.value.dispose();
    }
});
</script>

<template>
    <div ref="domRef" id="dockview_root" style="height: 100%; width: 100%">
        <!-- JSON.stringify(this.$props) -->
    </div>
</template>
../types/dockview
