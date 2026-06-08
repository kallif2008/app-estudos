<template>
  <div>
    <Sidebar />

    <div>
      <div
        v-if="!isDesktop"
        class="fixed top-0 left-0 right-0 z-30 h-16 flex backdrop-blur-xl bg-[#01051F] border-b border-cyan-500/10 px-6 items-center justify-between"
      >
        <button
          @click="toggleSidebar"
          class="text-slate-400 hover:text-white transition"
        >
          <svg-icon type="mdi" :path="mdiMenu" class="w-6 h-6" />
        </button>
      </div>

      <div v-else />

      <div class="sm:pt-16 md:pt-16">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMenu } from "@mdi/js";
import { useSidebar } from "@/components/sidebar/useSidebar";
import Sidebar from "@/components/sidebar/index.vue";
import { ref, onMounted, onUnmounted } from "vue";

const { toggleSidebar } = useSidebar();

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
</script>
