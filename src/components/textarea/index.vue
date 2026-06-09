<template>
  <div>
    <label :for="id" class="block text-sm mb-1 text-slate-300" v-if="label">
      {{ label }}
    </label>

    <textarea
      :id="id"
      :rows="2"
      :placeholder="placeholder"
      class="w-full rounded-xl p-4 bg-[#0F172A] border border-cyan-500/20 text-white"
      :value="modelValue"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  placeholder?: string;
  modelValue?: string | null;
  label?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const onChange = (event: Event) => {
  const input = event.target as HTMLTextAreaElement;
  emit("update:modelValue", input.value);
};
</script>
