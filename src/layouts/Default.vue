<template>
  <div>
    <div
      class="fixed top-0 left-0 w-full h-16 z-30 backdrop-blur-xl bg-[#01051F] border-b border-cyan-500/10 px-6 flex justify-between items-center"
    >
      <div class="flex items-center gap-4">
        <img src="/memora-logo.png" class="w-40 sm:w-28" />

        <button
          class="text-slate-300 hover:text-cyan-300 transition"
          @click="router.push('/temas')"
        >
          Página inicial
        </button>
      </div>

      <button
        @click="limparSessao()"
        class="text-slate-300 hover:text-red-400 transition"
      >
        <svg-icon type="mdi" :path="mdiLogout" class="w-6 h-6" />
      </button>
    </div>

    <div class="pt-16">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLogout } from "@mdi/js";
import { useRouter } from "vue-router";
import { useSessao } from "@/utils/sessao";

const router = useRouter();
const { limparSessao } = useSessao();
</script>
