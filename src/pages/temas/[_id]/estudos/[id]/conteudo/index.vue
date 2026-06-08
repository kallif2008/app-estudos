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
    :titulo="tipoAcao === 'criar' ? 'Monte o seu estudo' : 'Edite o seu estudo'"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-row flex-wrap gap-2 items-center justify-start">
        <ce-checkbox
          label="Gerar com IA"
          v-model="personalizarEstudo.gerarComIA"
        />
        <ce-checkbox
          label="Gerar áudio com IA"
          v-model="personalizarEstudo.gerarAudioComIA"
          v-if="personalizarEstudo.gerarComIA"
        />
        <ce-checkbox
          label="Texto"
          v-model="personalizarEstudo.texto"
          v-if="!personalizarEstudo.gerarComIA"
        />
        <ce-checkbox
          label="Áudio"
          v-model="personalizarEstudo.audio"
          v-if="!personalizarEstudo.gerarComIA"
        />
        <ce-checkbox
          label="Vídeo"
          v-model="personalizarEstudo.video"
          v-if="!personalizarEstudo.gerarComIA"
        />
        <ce-checkbox
          label="Extrair texto do áudio"
          v-model="personalizarEstudo.extrairTextoAudio"
          v-if="!personalizarEstudo.gerarComIA"
        />
        <ce-checkbox
          :disabled="
            !personalizarEstudo.texto &&
            !personalizarEstudo.extrairTextoAudio &&
            !personalizarEstudo.gerarComIA
          "
          label="Converter texto em frases"
          v-model="personalizarEstudo.converterTextoFrases"
        />
      </div>

      <CortarAudio
        @cortado="(file: File) => (conteudo.audio = file)"
        v-if="personalizarEstudo.audio && !personalizarEstudo.gerarComIA"
      />

      <Input
        v-if="personalizarEstudo.video && !personalizarEstudo.gerarComIA"
        type="url"
        placeholder="Digite a URL do vídeo"
      />

      <textarea
        v-if="personalizarEstudo.texto && !personalizarEstudo.gerarComIA"
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
    v-if="!fraseAtual?.textoCompleto"
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
          class="rounded-3xl p-[2px] bg-gradient-to-r from-cyan-500 to-fuchsia-500"
        >
          <div
            class="rounded-3xl bg-[#081121]/90 backdrop-blur-xl p-8 min-h-[250px] flex flex-col justify-between"
          >
            <div class="flex flex-col items-start">
              <OpcoesEstudo />

              <ce-tooltip
                location="top"
                focus
                :text="fraseAtual?.traducao || 'Sem tradução'"
              >
                <template #activator>
                  <button
                    class="text-white font-semibold w-full whitespace-pre-line leading-relaxed"
                    :class="
                      fraseAtual?.textoCompleto
                        ? 'text-base text-start'
                        : 'text-3xl'
                    "
                  >
                    {{
                      fraseAtual?.frase ||
                      fraseAtual?.textoCompleto ||
                      "Sem frase"
                    }}
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

        <div
          class="flex justify-center gap-4 mt-8"
          v-if="!fraseAtual?.textoCompleto"
        >
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
          v-if="audioUrl || audioComIa[indiceAtual]"
          class="flex gap-1 mt-8 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-3"
        >
          <audio
            ref="audioPlayer"
            :src="
              audioUrl || `data:audio/wav;base64,${audioComIa[indiceAtual]}`
            "
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
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useApiConteudo } from "./useApiConteudo";

///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiKeyboardBackspace } from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import CortarAudio from "@/components/cortarAudio/index.vue";
import OpcoesEstudo from "@/components/opcoesEstudo/index.vue";
import { CeTooltip, CeCheckbox } from "@comercti/vue-components";
import Input from "@/components//input/index.vue";

const { ativarLoading, desativarLoading } = useLoading();

defineProps<{
  id: string;
  _id: string;
}>();

const route = useRoute();
const router = useRouter();

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
  personalizarEstudo,
  queryParams,
  audioComIa,
  criarConteudo,
  obterConteudo,
  toggleModal,
  proximoCard,
  cardAnterior,
} = useConteudo();

const {
  criarFrase,
  obterFrases,
  atualizarFrases,
  atualizarAudio,
  carregarAudio,
  obterStatusEstudo,
} = useApiConteudo();

const { abrirModal } = useModal();

onBeforeMount(() => {
  queryParams.value = {
    agenteId: (route.query.agenteId as string) || "",
    agenteIdExplicacao: (route.query.agenteIdExplicacao as string) || "",
    tradutor: route.query.tradutor === "true",
  };
});

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

watch(
  () => personalizarEstudo.value.extrairTextoAudio,
  (novoValor) => {
    if (novoValor) {
      personalizarEstudo.value.audio = true;
      return;
    }
    personalizarEstudo.value.converterTextoFrases = false;
  },
);

watch(
  () => personalizarEstudo.value.audio,
  (novoValor) => {
    if (!novoValor) {
      personalizarEstudo.value.extrairTextoAudio = false;
    }
  },
);

watch(
  () => personalizarEstudo.value.texto,
  (novoValor) => {
    if (novoValor) {
      personalizarEstudo.value.converterTextoFrases = false;
      personalizarEstudo.value.extrairTextoAudio = false;
    }
  },
  { deep: true },
);

watch(
  () => personalizarEstudo.value.extrairTextoAudio,
  (novoValor) => {
    if (novoValor) {
      personalizarEstudo.value.texto = false;
      return;
    }
  },
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
