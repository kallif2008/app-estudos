<template>
  <div class="border-b border-cyan-500/10 last:border-b-0">
    <button
      @click="toggle"
      class="w-full flex items-center justify-between gap-3 py-3 text-left transition hover:bg-slate-800/40 rounded-lg px-1"
    >
      <span class="text-sm font-medium text-slate-300">
        <slot name="title">{{ title }}</slot>
      </span>

      <svg-icon
        type="mdi"
        :path="mdiChevronDown"
        class="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300"
        :class="{ 'rotate-180': aberto }"
      />
    </button>

    <div
      class="grid min-h-0"
      :style="{
        gridTemplateRows: aberto ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.3s ease',
      }"
    >
      <div class="overflow-hidden min-h-0">
        <div class="pb-3 text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown } from "@mdi/js";
import { ref } from "vue";

defineProps<{
  title?: string;
}>();

const aberto = ref(false);

const toggle = () => {
  aberto.value = !aberto.value;
};
</script>
