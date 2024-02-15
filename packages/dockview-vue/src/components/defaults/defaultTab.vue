<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IDockviewPanelHeaderProps } from '../../types/panel';

const props = defineProps<
    IDockviewPanelHeaderProps & { hideClose?: boolean; preventClose?: boolean }
>();

const emit = defineEmits(['close']);

function onClose(event: MouseEvent) {
    event.preventDefault();

    if (props.preventClose) {
        emit('close');
    } else {
        props.api.close();
    }
}

function onClick(event: MouseEvent) {
    if (event.defaultPrevented) return;

    props.api.setActive();

    //   if (props.onclick) {
    //     props.onclick(event)
    //   }
}

const title = ref(props.api.title);

onMounted(() => {
    title.value = props.api.title;
});
</script>

<template>
    <div
        v-bind="props"
        className="dockview-vue-tab"
        data-testid="dockview-default-tab"
        @click="onClick"
    >
        <span className="dockview-vue-tab-title">{{ title }}</span>
        <div
            v-if="!props.hideClose"
            className="dv-vue-tab-close-btn"
            @onClick="onClose"
        ></div>
    </div>
</template>

<style lang="scss">
.tab {
    .dockview-vue-tab {
        display: flex;
        padding: 0px 8px;
        align-items: center;
        height: 100%;

        .dockview-vue-tab-title {
            padding: 0px 8px;
            flex-grow: 1;
        }

        .dv-vue-tab-close-btn {
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;

            &:hover {
                border-radius: 2px;
                background-color: var(--dv-icon-hover-background-color);
            }
        }
    }

    &.inactive-tab:not(:hover) {
        .dv-vue-tab-close-btn {
            visibility: hidden;
        }
    }
}
</style>
