<template>
  <!-- Modal criação -->

  <Modal
    :abrir-modal="abrirModal"
    :salvar="
      () => {
        tipoAcao === 'criar'
          ? criarConteudo(criarFrase, obterFrases)
          : atualizarAudio();
      }
    "
    @fechar-modal="toggleModal('criar')"
    :titulo="tipoAcao === 'criar' ? 'Criar conteúdo' : 'Editar conteúdo'"
  >
    <div class="flex flex-col gap-4">
      <CortarAudio @cortado="(file: File) => (conteudo.audio = file)" />

      <textarea
        v-if="tipoAcao !== 'editar'"
        v-model="conteudo.frase"
        rows="4"
        placeholder="Texto completo"
        class="rounded-xl p-4 bg-[#0F172A] border border-cyan-500/20 text-white"
      />
    </div>
  </Modal>

  <!-- Modal edição -->

  <Modal
    :abrir-modal="abrirModalEditarAudio"
    @fechar-modal="abrirModalEditarAudio = false"
    :salvar="
      () => {
        atualizarFrases();
        abrirModalEditarAudio = false;
      }
    "
  >
    <div class="space-y-4">
      <textarea
        v-model="conteudo.frase"
        rows="2"
        placeholder="Frase"
        class="w-full rounded-xl p-4 bg-[#0F172A] border border-cyan-500/20 text-white"
      />

      <textarea
        v-model="conteudo.traducao"
        rows="2"
        placeholder="Tradução"
        class="w-full rounded-xl p-4 bg-[#0F172A] border border-cyan-500/20 text-white"
      />

      <CortarAudio
        emitir-tempo-cortado
        :audio="audioUrl"
        @tempo="
          (tempos) => {
            conteudo.inicioAudio = tempos.inicioAudio;

            conteudo.fimAudio = tempos.fimAudio;
          }
        "
      />
    </div>
  </Modal>

  <Modal
    :abrir-modal="abrirModalVisualizarTextoCompleto"
    @fechar-modal="abrirModalVisualizarTextoCompleto = false"
    titulo="Texto completo"
    subtitulo=""
  >
    <div class="p-2">
      <p
        class="text-slate-300"
        v-for="(frase, index) in dataFrases.frases.map((f) => f.frase)"
        :key="index"
      >
        {{ frase }}
      </p>
    </div>
  </Modal>

  <!-- Tela -->

  <div class="relative min-h-screen overflow-hidden">
    <img
      src="/fundoLogin.png"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <div class="absolute inset-0 bg-[#020617]/70" />

    <div class="relative z-10 max-w-4xl mx-auto px-6 py-10">
      <SemConteudo
        v-if="dataFrases.frases.length === 0"
        :fn="() => toggleModal('criar')"
        label="Criar conteúdo"
        :texto="
          !statusEstudo
            ? 'Adicione conteúdos para começar.'
            : statusEstudo === 'pendente'
              ? 'Estudo aguardando para ser criado'
              : statusEstudo === 'processando'
                ? 'A criação do estudo está em andamento'
                : 'Estudo concluído'
        "
        :titulo="
          !statusEstudo
            ? 'Nenhum conteúdo encontrado'
            : statusEstudo === 'pendente'
              ? 'Estudo pendente'
              : statusEstudo === 'processando'
                ? 'Estudo em processamento'
                : 'Estudo concluído'
        "
        :mostrarVoltar="true"
      />

      <template v-else>
        <!-- topo -->

        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-white">Seus conteúdos</h1>

          <div class="flex items-center gap-3">
            <button @click="router.back()" class="action-button">
              <svg-icon
                type="mdi"
                :path="mdiKeyboardBackspace"
                class="w-5 h-5"
              />
            </button>
          </div>
        </div>

        <!-- contador -->

        <div class="text-center text-slate-400 mb-5">
          {{ indiceAtual + 1 }}
          /
          {{ dataFrases.frases.length }}
        </div>

        <!-- card -->

        <div
          class="rounded-3xl p-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500"
        >
          <div
            class="rounded-3xl bg-[#081121]/90 backdrop-blur-xl p-8 min-h-[250px] flex flex-col justify-between"
          >
            <div class="flex flex-col items-start">
              <div class="flex justify-between mb-8">
                <div class="flex gap-2 sm:flex-wrap">
                  <ce-tooltip location="top" text="Traduzir frase">
                    <template #activator>
                      <button
                        :disabled="!!fraseAtual?.traducao"
                        class="action-button"
                        @click="
                          () => {
                            setarInfoParaEditarConteudo(fraseAtual as IFrases);

                            atualizarFrases();
                          }
                        "
                      >
                        <svg-icon
                          type="mdi"
                          :path="mdiGoogleTranslate"
                          :class="
                            fraseAtual?.traducao
                              ? 'text-green-600'
                              : 'text-white'
                          "
                        />
                      </button>
                    </template>
                  </ce-tooltip>
                  <ce-tooltip location="top" text="Ouvir frase">
                    <template #activator>
                      <button
                        class="action-button"
                        @click="
                          () => {
                            tocarTrecho(
                              Number(fraseAtual?.inicioAudio),
                              Number(fraseAtual?.fimAudio),
                            );
                          }
                        "
                      >
                        <svg-icon type="mdi" :path="mdiPlay" />
                      </button>
                    </template>
                  </ce-tooltip>
                  <ce-tooltip location="top" text="Editar frase">
                    <template #activator>
                      <button
                        class="action-button"
                        @click="
                          () => {
                            setarInfoParaEditarConteudo(fraseAtual as IFrases);

                            abrirModalEditarAudio = true;
                          }
                        "
                      >
                        <svg-icon type="mdi" :path="mdiPencil" />
                      </button>
                    </template>
                  </ce-tooltip>
                  <ce-tooltip location="top" text="Deletar frase">
                    <template #activator>
                      <button
                        class="action-button"
                        @click="deletarFrase(fraseAtual?._id || '')"
                      >
                        <svg-icon type="mdi" :path="mdiTrashCan" />
                      </button>
                    </template>
                  </ce-tooltip>
                  <ce-tooltip location="top" text="Visualizar texto completo">
                    <template #activator>
                      <button
                        class="action-button"
                        @click="abrirModalVisualizarTextoCompleto = true"
                      >
                        <svg-icon type="mdi" :path="mdiEye" />
                      </button>
                    </template>
                  </ce-tooltip>
                  <ce-tooltip location="top" text="Explicar com IA">
                    <template #activator>
                      <button
                        class="action-button"
                        @click="obterExplicacaoIA(fraseAtual?.frase || '')"
                      >
                        <svg-icon type="mdi" :path="mdiRobotHappy" />
                      </button>
                    </template>
                  </ce-tooltip>
                  <ce-tooltip location="top" text="Chat com IA">
                    <template #activator>
                      <button class="action-button" @click="alternarChat">
                        <svg-icon type="mdi" :path="mdiChat" />
                      </button>
                    </template>
                  </ce-tooltip>
                </div>
              </div>
              <ce-tooltip
                location="top"
                focus
                :text="fraseAtual?.traducao || 'Sem tradução'"
              >
                <template #activator>
                  <button
                    class="text-white font-semibold w-full text-3xl whitespace-pre-line leading-relaxed"
                  >
                    {{ fraseAtual?.frase }}
                  </button>
                </template>
              </ce-tooltip>

              <div
                v-if="textoDigitacaoIA && !consultandoIA"
                class="mt-6 p-4 rounded-xl bg-slate-800/50 border border-cyan-500/20 text-slate-200 whitespace-pre-line text-base"
              >
                {{ textoDigitacaoIA
                }}<span v-if="isDigitandoIA" class="animate-pulse">|</span>
              </div>

              <div
                v-if="consultandoIA"
                class="mt-6 p-4 rounded-xl bg-slate-800/50 border border-cyan-500/20 text-slate-200 whitespace-pre-line text-base flex items-center gap-3"
              >
                <div
                  class="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"
                ></div>
                <p>Consultando IA...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- navegação -->

        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="cardAnterior"
            :disabled="indiceAtual === 0 || isDigitandoIA || consultandoIA"
            class="nav-button"
          >
            ← Anterior
          </button>

          <button
            @click="proximoCard"
            :disabled="
              indiceAtual === dataFrases.frases.length - 1 ||
              isDigitandoIA ||
              consultandoIA
            "
            class="nav-button-primary"
          >
            Próximo →
          </button>
        </div>

        <!-- áudio -->

        <div
          class="flex gap-1 mt-8 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-3"
        >
          <audio
            ref="audioPlayer"
            :src="audioUrl || ''"
            controls
            class="w-full bg-transparent"
          />

          <button @click="toggleModal('editar')">
            <svg-icon
              type="mdi"
              :path="mdiPencil"
              class="text-white w-6 h-6 cursor-pointer"
            ></svg-icon>
          </button>
        </div>
      </template>
    </div>
  </div>

  <ChatIA />
</template>

<route lang="json">
{
  "meta": {
    "title": "inicio",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import Modal from "@/components/modal/index.vue";
import ChatIA from "@/components/chatIA/index.vue";
import { useConteudo } from "./useConteudo";
import { onMounted, ref, watch } from "vue";
import { useApiConteudo } from "./useApiConteudo";
import { useChatIA } from "./useChatIA";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiPencil,
  mdiKeyboardBackspace,
  mdiRobotHappy,
  mdiChat,
  mdiPlay,
  mdiGoogleTranslate,
  mdiTrashCan,
  mdiEye,
} from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import CortarAudio from "@/components/cortarAudio/index.vue";
import type { IFrases } from "./interfaces";
import { CeTooltip } from "@comercti/vue-components";

const { ativarLoading, desativarLoading } = useLoading();

defineProps<{
  id: string;
  _id: string;
}>();

const route = useRoute();
const router = useRouter();
const audioPlayer = ref<HTMLAudioElement | null>(null);

const tocarTrecho = (inicio: number | string, fim: number | string) => {
  if (!audioPlayer.value) return;

  const player = audioPlayer.value;

  // garantir que sejam números
  let start = Number(inicio);
  let end = Number(fim);

  // se backend enviou em milissegundos (ex: 140640), converte para segundos
  if (!isNaN(start) && start > 1000) start = start / 1000;
  if (!isNaN(end) && end > 1000) end = end / 1000;

  if (isNaN(start) || isNaN(end)) return;
  if (end <= start) return;

  // garantir que o tempo pedido esteja dentro da duração do áudio
  if (player.duration && start > player.duration) return;

  player.currentTime = start;
  player.play();

  const pararNoFim = () => {
    if (player.currentTime >= end) {
      player.pause();
      player.removeEventListener("timeupdate", pararNoFim);
    }
  };

  // remover listeners antigos para evitar múltiplas chamadas
  player.removeEventListener("timeupdate", pararNoFim);
  player.addEventListener("timeupdate", pararNoFim);
};

const {
  dataFrases,
  conteudo,
  idEstudoAtual,
  tipoAcao,
  audioUrl,
  abrirModalEditarAudio,
  indiceAtual,
  fraseAtual,
  abrirModalVisualizarTextoCompleto,
  consultandoIA,
  textoDigitacaoIA,
  isDigitandoIA,
  statusEstudo,
  criarConteudo,
  obterConteudo,
  toggleModal,
  setarInfoParaEditarConteudo,
  proximoCard,
  cardAnterior,
} = useConteudo();

const {
  criarFrase,
  obterFrases,
  atualizarFrases,
  atualizarAudio,
  carregarAudio,
  deletarFrase,
  obterExplicacaoIA,
  obterStatusEstudo,
} = useApiConteudo();

const { abrirModal } = useModal();

const { alternarChat } = useChatIA();

onMounted(async () => {
  idEstudoAtual.value = route.params.id as string;

  await Promise.all([obterConteudo(obterFrases), obterStatusEstudo()]);
});

watch(
  () => dataFrases.value,
  async (novoValor) => {
    if (!novoValor.audioUrl) return;

    ativarLoading();

    audioUrl.value = await carregarAudio(novoValor.audioUrl);

    desativarLoading();
  },
  { immediate: true },
);
</script>

<style scoped>
.action-button {
  @apply h-10
w-10
rounded-full
bg-slate-800/70
text-slate-300
flex
items-center
justify-center
hover:bg-cyan-500/20
hover:text-cyan-300
transition;
}

.nav-button {
  @apply px-6
py-3
rounded-xl
border
border-cyan-500/20
text-slate-300
hover:bg-slate-800
disabled:opacity-30
transition;
}

.nav-button-primary {
  @apply px-6
py-3
rounded-xl
font-medium
text-black
bg-gradient-to-r
from-cyan-400
to-fuchsia-500
hover:scale-105
disabled:opacity-30
transition;
}

audio {
  background-color: transparent !important;
  color: #fff !important;
}

audio::-webkit-media-controls-panel,
audio::-webkit-media-controls-enclosure {
  background-color: transparent !important;
  color: #fff !important;
}
</style>
