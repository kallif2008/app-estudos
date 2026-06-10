<template>
  <!-- Modal criação -->

  <Modal
    :abrir-modal="abrirModal"
    :salvar="
      () => {
        tipoAcao === 'criar'
          ? criarConteudo(criarFrase, obterStatusEstudo)
          : atualizarAudio();
      }
    "
    @fechar-modal="toggleModal('criar')"
    titulo="Monte o seu estudo"
  >
    <Loading :show-loading="showLoading" mensagem="SELECIONANDO TRECHO" />

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

      <Textarea
        v-if="personalizarEstudo.texto && !personalizarEstudo.gerarComIA"
        v-model="conteudo.frase"
        id="frase"
        placeholder="Digite a frase"
      />
    </div>
  </Modal>

  <!-- Modal edição -->

  <Modal
    :abrir-modal="abrirModalEditarAudio"
    @fechar-modal="abrirModalEditarAudio = false"
    titulo="Edite seu estudo"
    :salvar="
      () => {
        atualizarFrases();
        abrirModalEditarAudio = false;
      }
    "
  >
    <div class="flex flex-col justify-center gap-4">
      <Textarea
        label="Frase"
        v-model="conteudo.frase"
        id="frase"
        placeholder="Digite a frase"
      />

      <Textarea
        label="Tradução"
        v-model="conteudo.traducao"
        id="traducao"
        placeholder="Digite a tradução"
      />

      <div
        v-if="audioUrl && !fraseAtual?.textoCompleto"
        class="flex flex-col justify-center gap-4"
      >
        <div
          class="flex gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-3"
        >
          <audio
            ref="audioPlayer"
            :src="
              audioUrl || `data:audio/wav;base64,${audioComIa[indiceAtual]}`
            "
            controls
            class="w-full"
          />
        </div>

        <div class="flex items-center sm:flex-col gap-2 w-full">
          <Input
            type="time"
            label="Início áudio"
            class="!w-full"
            :modelValue="milissegundosParaHMS(fraseAtual?.inicioAudio)"
            @update:model-value="
              (valor) => (conteudo.inicioAudio = String(valor))
            "
          />
          <Input
            type="time"
            label="Final áudio"
            class="!w-full"
            :modelValue="milissegundosParaHMS(fraseAtual?.fimAudio)"
            @update:model-value="
              (valor) => {
                conteudo.fimAudio = String(valor);
              }
            "
          />
        </div>
      </div>
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
            <ce-tooltip location="top" text="Deletar conteúdo completo">
              <template #activator>
                <button
                  class="action-button"
                  @click="deletarConteudoCompleto(idEstudoAtual)"
                >
                  <svg-icon type="mdi" :path="mdiTrashCan" />
                </button>
              </template>
            </ce-tooltip>

            <ce-tooltip location="top" text="Voltar">
              <template #activator>
                <button @click="router.back()" class="action-button">
                  <svg-icon
                    type="mdi"
                    :path="mdiKeyboardBackspace"
                    class="w-5 h-5"
                  />
                </button>
              </template>
            </ce-tooltip>
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
              <OpcoesEstudo :tocar-trecho="tocarTrecho" />

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
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
import { useApiConteudo } from "./useApiConteudo";
import Textarea from "@/components/textarea/index.vue";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiKeyboardBackspace, mdiTrashCan } from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import CortarAudio from "@/components/cortarAudio/index.vue";
import OpcoesEstudo from "@/components/opcoesEstudo/index.vue";
import { CeTooltip, CeCheckbox } from "@comercti/vue-components";
import Input from "@/components//input/index.vue";
import Loading from "@/components/loading/index.vue";

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
  showLoading,
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
  deletarConteudoCompleto,
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

  await obterStatusEstudo();

  if (statusEstudo.value === "concluido") {
    await obterConteudo(obterFrases);
    return;
  }

  if (
    statusEstudo.value === "pendente" ||
    statusEstudo.value === "processando"
  ) {
    iniciarPolling();
  }
});

onUnmounted(() => {
  pararPolling();
});

let pollingInterval: ReturnType<typeof setInterval> | null = null;

const iniciarPolling = () => {
  pollingInterval = setInterval(async () => {
    await obterStatusEstudo();

    if (statusEstudo.value === "concluido") {
      await obterConteudo(obterFrases);
      pararPolling();
      return;
    }

    if (statusEstudo.value === "erro") {
      pararPolling();
    }
  }, 5000);
};

const pararPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const milissegundosParaHMS = (ms: number | undefined | null): string => {
  if (ms === undefined || ms === null || isNaN(Number(ms))) return "";
  const totalSegundos = Math.floor(Number(ms) / 1000);
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
};

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
