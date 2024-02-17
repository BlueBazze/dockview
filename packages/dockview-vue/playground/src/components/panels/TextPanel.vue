<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { IDockviewPanelProps } from '../../../../src/main';

const props = defineProps<IDockviewPanelProps>();

const counter = ref(0);
</script>

<template>
    <div
        style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        "
    >
        Hello world
        <br />
        {{ counter % 2 === 1 ? props.api.title : props.containerApi.height }}
        <br />
        {{ counter }}
        <button @click="counter++">Increment</button>
    </div>
</template>
