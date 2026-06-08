<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-4">
      <Input
        label="Título"
        placeholder="Digite o título"
        estilo="light"
        v-model="conteudo.titulo"
        class="!bg-[#0F172A]/90 rounded-xl"
      />
      <Input
        label="Descrição"
        placeholder="Digite a descrição"
        estilo="light"
        v-model="conteudo.descricao"
        class=""
      />
      <Select
        label="Agente"
        placeholder="Selecione um agente"
        :items="agentesSelect"
        v-model="conteudo.agenteId"
      />

      <Select
        label="Agente para explicação"
        placeholder="Selecione um agente para explicação"
        :items="agentesSelect"
        v-model="conteudo.agenteIdExplicacao"
      />

      <CeToggle label="Tradutor" v-model="conteudo.tradutor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/input/index.vue";
import { computed } from "vue";
import Select from "@/components/select/index.vue";
import { useAgentes } from "@/pages/agentes/useAgentes";
import { CeToggle } from "@comercti/vue-components";

const { agentesSelect } = useAgentes();

const props = defineProps<{
  modelValue?: {
    titulo: string;
    descricao: string;
    agenteId?: string;
    tradutor?: boolean;
    agenteIdExplicacao?: string;
  };
}>();

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: {
      titulo: string;
      descricao: string;
      agenteId?: string;
      tradutor?: boolean;
      agenteIdExplicacao?: string;
    },
  ): void;
}>();

const conteudo = computed({
  get() {
    return (
      props.modelValue ?? {
        titulo: "",
        descricao: "",
        agenteId: "",
        tradutor: false,
        agenteIdExplicacao: "",
      }
    );
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
