<template>
  <div>
    <label v-if="label" class="block text-sm mb-1 text-slate-300">
      {{ label }}
    </label>

    <div class="relative">
      <select
        :value="modelValue"
        @change="onChange"
        class="w-full px-4 py-2 rounded-lg border bg-[#0F172A] text-slate-100 border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer pr-10"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>

        <option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          class="bg-[#0F172A] text-slate-100"
        >
          {{ item.text }}
        </option>
      </select>

      <div
        class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
      >
        <svg-icon type="mdi" :path="mdiChevronDown" class="w-5 h-5 text-slate-400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown } from "@mdi/js";

interface SelectItem {
  text: string;
  value: string;
}

const props = defineProps<{
  modelValue?: string;
  label?: string;
  placeholder?: string;
  items: SelectItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const onChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  emit("update:modelValue", select.value);
};
</script>
