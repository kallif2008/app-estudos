<template>
  <transition name="fade">
    <div
      v-if="sidebarAberto && !isDesktop"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="fecharSidebar"
    />
  </transition>

  <aside
    @mouseenter="isDesktop && abrirSidebar()"
    @mouseleave="isDesktop && fecharSidebar()"
    class="fixed top-0 left-0 z-50 h-full bg-[#01051F] border-r border-cyan-500/10 flex flex-col transition-all duration-300 overflow-hidden"
    :class="
      isDesktop
        ? sidebarAberto
          ? 'w-64 translate-x-0'
          : 'w-16 translate-x-0'
        : sidebarAberto
          ? 'w-64 translate-x-0'
          : 'w-64 -translate-x-full'
    "
  >
    <div
      class="flex items-center h-16 px-3 border-b border-cyan-500/10 shrink-0"
      :class="isDesktop && !sidebarAberto ? 'justify-center' : ''"
    >
      <img src="/memora-fundo.png" class="w-8 shrink-0" />
      <span
        v-show="!isDesktop || sidebarAberto"
        class="text-white font-semibold ml-3 whitespace-nowrap"
      >
        Memora
      </span>
    </div>

    <nav class="flex-1 px-2 py-4 space-y-1 overflow-hidden">
      <router-link
        v-for="item in navItens"
        :key="item.path"
        :to="item.path"
        @click="!isDesktop && fecharSidebar()"
        class="flex items-center rounded-lg text-sm font-medium transition"
        :class="[
          isDesktop && !sidebarAberto ? 'justify-center px-0' : 'px-3',
          linkClasses(item.path),
        ]"
      >
        <svg-icon
          type="mdi"
          :path="item.icone"
          class="w-5 h-5 shrink-0 my-2.5"
        />
        <span
          v-show="!isDesktop || sidebarAberto"
          class="ml-3 whitespace-nowrap"
        >
          {{ item.label }}
        </span>
      </router-link>
    </nav>

    <div
      class="pb-4 pt-3 border-t border-cyan-500/10"
      :class="isDesktop && !sidebarAberto ? 'px-2' : 'px-3'"
    >
      <button
        @click="limparSessao()"
        class="flex items-center rounded-lg text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800/60 transition w-full"
        :class="isDesktop && !sidebarAberto ? 'justify-center px-0' : 'px-3'"
      >
        <svg-icon
          type="mdi"
          :path="mdiLogout"
          class="w-5 h-5 shrink-0 my-2.5"
        />
        <span
          v-show="!isDesktop || sidebarAberto"
          class="ml-3 whitespace-nowrap"
        >
          Sair
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLogout, mdiHomeOutline, mdiAccountGroup } from "@mdi/js";
import { useRoute } from "vue-router";
import { useSessao } from "@/utils/sessao";
import { useSidebar } from "./useSidebar";
import { ref, onMounted, onUnmounted } from "vue";

const route = useRoute();
const { limparSessao } = useSessao();
const { sidebarAberto, fecharSidebar, abrirSidebar } = useSidebar();

const isDesktop = ref(false);
let mql: MediaQueryList | null = null;

function handleChange(e: MediaQueryListEvent | MediaQueryList) {
  isDesktop.value = e.matches;
}

onMounted(() => {
  mql = window.matchMedia("(min-width: 1024px)");
  handleChange(mql);
  mql.addEventListener("change", handleChange);
});

onUnmounted(() => {
  mql?.removeEventListener("change", handleChange);
});

const navItens = [
  { label: "Início", path: "/temas", icone: mdiHomeOutline },
  { label: "Agentes", path: "/agentes", icone: mdiAccountGroup },
];

function linkClasses(path: string) {
  const active =
    route.path === path || (route.path.startsWith(path) && path !== "/");
  return {
    "text-cyan-300 bg-slate-800/60": active,
    "text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60": !active,
  };
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
