<template>
  <transition name="fade">
    <div
      v-if="abrirModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
    >
      <!-- brilho fundo -->
      <div
        class="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] top-1/4 left-1/3"
      />

      <!-- borda neon -->
      <div
        class="relative w-full max-w-2xl p-[2px] rounded-[28px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 shadow-[0_0_30px_rgba(34,211,238,.25)]"
      >
        <!-- conteúdo -->
        <div
          class="rounded-[28px] bg-[#081121]/95 backdrop-blur-xl p-6 overflow-auto max-h-[85vh]"
        >
          <!-- header -->
          <div
            class="flex items-center justify-between mb-6 border-b border-slate-800 pb-4"
          >
            <div>
              <h2 class="text-xl font-semibold text-white">
                {{ titulo }}
              </h2>

              <p class="text-sm text-slate-400 mt-1">
                {{ subtitulo }}
              </p>
            </div>

            <button
              @click="emit('fecharModal')"
              class="h-10 w-10 rounded-full flex items-center justify-center bg-slate-800/70 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
            >
              ✕
            </button>
          </div>

          <form class="space-y-5" @submit.prevent="salvar">
            <slot />

            <div
              class="flex justify-end gap-3 pt-5 border-t border-slate-800 sm:flex-col"
            >
              <!-- cancelar -->
              <button
                type="button"
                @click="emit('fecharModal')"
                class="px-5 py-3 rounded-xl border border-cyan-500/20 text-slate-300 hover:bg-slate-800 transition"
              >
                Fechar
              </button>

              <!-- salvar -->
              <button
                v-if="salvar"
                type="submit"
                class="px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:scale-[1.02] transition shadow-[0_0_25px_rgba(56,189,248,.35)]"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

<script setup lang="ts">
import { type PropType } from "vue";

const props = defineProps({
  abrirModal: {
    type: Boolean,
    required: true,
  },
  salvar: {
    type: Function as PropType<() => void>,
    required: false,
  },
  titulo: {
    type: String,
    required: false,
  },
  subtitulo: {
    type: String,
    required: false,
    default: "Preencha as informações abaixo",
  },
});

const emit = defineEmits<{
  (e: "fecharModal"): void;
}>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
