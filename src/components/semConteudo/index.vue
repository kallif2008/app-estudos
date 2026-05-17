<template>
  <div
    class="rounded-3xl bg-[#081121]/80 backdrop-blur-lg border border-cyan-500/20 p-8 max-w-lg mx-auto flex flex-col items-center text-center"
  >
    <Vue3Lottie :animationData="NaoEncontradoJSON" :height="220" />

    <h1 class="text-2xl font-bold text-white">
      {{ titulo }}
    </h1>

    <p class="text-slate-400 mt-2 mb-6">
      {{ texto }}
    </p>

    <div class="w-full flex flex-col gap-3">
      <Button v-if="mostrarBotao" @click="fn">
        {{ label }}
      </Button>

      <Button v-if="mostrarVoltar" variant="outline" @click="router.back()">
        Voltar
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import NaoEncontradoJSON from "@/assets/naoEncontrado.json";
import { Vue3Lottie } from "vue3-lottie";
import Button from "@/components/botao/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  fn: {
    type: Function,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  texto: {
    type: String,
    required: false,
  },
  titulo: {
    type: String,
    required: true,
  },
  mostrarBotao: {
    type: Boolean,
    required: false,
    default: true,
  },
  mostrarVoltar: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
