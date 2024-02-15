<script lang="ts" setup>
import { ref } from 'vue';
import type { IDockviewPanelProps } from '../../../../src/main';

const props = defineProps<IDockviewPanelProps>();

const api = ref(props.api);

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
        {{ props.api.title }}
        <br />
        {{ counter }}
        <button @click="counter++">Increment</button>
    </div>
</template>
