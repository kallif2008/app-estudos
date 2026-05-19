<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="abrirChat"
        class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
      >
        <div
          class="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] top-1/4 left-1/3"
        />

        <div
          class="relative w-full max-w-2xl h-[600px] p-[2px] rounded-[28px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 shadow-[0_0_30px_rgba(34,211,238,.25)]"
        >
          <div
            class="flex flex-col rounded-[28px] bg-[#081121]/95 backdrop-blur-xl p-6 h-full"
          >
            <div
              class="flex items-center justify-between mb-4 border-b border-slate-800 pb-4"
            >
              <h2 class="text-xl font-semibold text-white">Chat com IA</h2>
              <button
                @click="alternarChat"
                class="h-10 w-10 rounded-full flex items-center justify-center bg-slate-800/70 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
              >
                <svg-icon type="mdi" :path="mdiClose" class="w-5 h-5" />
              </button>
            </div>

            <div
              ref="areaMensagens"
              class="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin"
            >
              <div
                v-for="(msg, index) in mensagens"
                :key="index"
                :class="
                  msg.papel === 'user'
                    ? 'flex justify-end'
                    : 'flex justify-start'
                "
              >
                <div
                  :class="
                    msg.papel === 'user'
                      ? 'bg-cyan-600 text-white rounded-2xl rounded-br-sm'
                      : 'bg-slate-700 text-slate-200 rounded-2xl rounded-bl-sm'
                  "
                  class="max-w-[80%] px-4 py-2.5"
                >
                  <p class="text-sm whitespace-pre-line leading-relaxed">
                    {{ msg.conteudo }}
                  </p>
                </div>
              </div>

              <div v-if="enviando" class="flex justify-start">
                <div
                  class="bg-slate-700 text-slate-400 rounded-2xl rounded-bl-sm px-4 py-2.5"
                >
                  <div class="flex gap-1">
                    <span
                      class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style="animation-delay: 0ms"
                    />
                    <span
                      class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style="animation-delay: 150ms"
                    />
                    <span
                      class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style="animation-delay: 300ms"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <input
                v-model="mensagemAtual"
                @keyup.enter="enviarMensagem"
                placeholder="Digite sua mensagem..."
                class="flex-1 rounded-xl bg-slate-800/70 border border-cyan-500/20 text-white px-4 py-3 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
              <button
                @click="enviarMensagem"
                :disabled="enviando || !mensagemAtual.trim()"
                class="px-4 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:scale-[1.02] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg-icon type="mdi" :path="mdiSend" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
import { useChatIA } from "@/pages/temas/[_id]/estudos/[id]/conteudo/useChatIA";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose, mdiSend } from "@mdi/js";

const {
  mensagens,
  mensagemAtual,
  enviando,
  abrirChat,
  enviarMensagem,
  alternarChat,
} = useChatIA();

const areaMensagens = ref<HTMLElement | null>(null);

const scrollarParaBaixo = () => {
  nextTick(() => {
    if (areaMensagens.value) {
      areaMensagens.value.scrollTop = areaMensagens.value.scrollHeight;
    }
  });
};

watch(
  () => mensagens.value.length,
  () => scrollarParaBaixo(),
);

watch(
  () => enviando.value,
  () => scrollarParaBaixo(),
);
</script>

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

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.3);
  border-radius: 99px;
}
</style>
