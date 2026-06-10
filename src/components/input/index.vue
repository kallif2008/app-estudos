<template>
  <div>
    <label v-if="label" class="block text-sm mb-1 text-slate-300">
      {{ label }}
    </label>

    <!-- FILE INPUT CUSTOM -->
    <div v-if="type === 'file'" class="relative">
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="audio/*,video/mp4"
        @change="onChange"
      />

      <button
        type="button"
        @click="openFileDialog"
        class="w-full px-4 py-2 rounded-lg border bg-[#0F172A] text-slate-100 border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer pr-10"
      >
        <span class="truncate">
          {{ fileName || "Nenhum ficheiro selecionado" }}
        </span>

        <span class="ml-4 text-sm font-medium text-cyan-500 whitespace-nowrap">
          Escolher ficheiro
        </span>
      </button>
    </div>

    <!-- INPUT NORMAL -->
    <div v-else class="relative">
      <input
        :type="type"
        :step="type === 'time' ? 2 : 0"
        :placeholder="placeholder"
        :value="modelValue"
        @change="onChange"
        class="w-full px-4 py-2 rounded-lg border bg-[#0F172A] text-slate-100 border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer pr-10"
        :class="{ 'dark-icon': type === 'date' || type === 'time' }"
      />

      <div
        v-if="$slots.trailing"
        class="absolute inset-y-0 right-3 flex items-center"
      >
        <slot name="trailing" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | File | null | number;
    label?: string;
    placeholder?: string;
    type?: string;
  }>(),
  {
    type: "text",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | File | null | number): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const fileName = computed(() =>
  props.modelValue instanceof File ? props.modelValue.name : "",
);

const openFileDialog = () => {
  fileInput.value?.click();
};

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (props.type === "file") {
    emit("update:modelValue", input.files?.[0] ?? null);
  } else {
    emit("update:modelValue", input.value);
  }
};
</script>

<style scoped>
.dark-icon::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(2);
}
</style>
