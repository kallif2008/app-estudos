<template>
  <div class="flex justify-between mb-8">
    <div class="flex gap-2 sm:flex-wrap">
      <ce-tooltip
        location="top"
        text="Traduzir frase"
        v-if="queryParams.tradutor"
      >
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
              :class="fraseAtual?.traducao ? 'text-green-600' : 'text-white'"
            />
          </button>
        </template>
      </ce-tooltip>

      <ce-tooltip
        location="top"
        text="Gerar áudio com IA"
        v-if="fraseAtual?.gerarAudioComIA && fraseAtual?.frase"
      >
        <template #activator>
          <button
            :disabled="!!fraseAtual?.traducao"
            class="action-button"
            @click="
              () => {
                criarAudioComIA(fraseAtual?.frase || '', indiceAtual);
              }
            "
          >
            <svg-icon
              type="mdi"
              :path="mdiPlay"
              :class="fraseAtual?.traducao ? 'text-green-600' : 'text-white'"
            />
          </button>
        </template>
      </ce-tooltip>
      <ce-tooltip
        location="top"
        text="Ouvir frase"
        v-if="
          audioUrl && !fraseAtual?.textoCompleto && !fraseAtual?.gerarAudioComIA
        "
      >
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
      <ce-tooltip
        location="top"
        text="Visualizar texto completo"
        v-if="fraseAtual?.frase"
      >
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
            @click="
              obterExplicacaoIA(
                fraseAtual?.frase || '',
                queryParams.agenteIdExplicacao || queryParams.agenteId,
              )
            "
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
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiPencil,
  mdiRobotHappy,
  mdiChat,
  mdiPlay,
  mdiGoogleTranslate,
  mdiTrashCan,
  mdiEye,
} from "@mdi/js";
import { CeTooltip } from "@comercti/vue-components";
import type { IFrases } from "@/pages/temas/[_id]/estudos/[id]/conteudo/interfaces";
import { ref } from "vue";
import { useChatIA } from "@/pages/temas/[_id]/estudos/[id]/conteudo/useChatIA";
import { useConteudo } from "@/pages/temas/[_id]/estudos/[id]/conteudo/useConteudo";
import { useApiConteudo } from "@/pages/temas/[_id]/estudos/[id]/conteudo/useApiConteudo";

const {
  setarInfoParaEditarConteudo,
  fraseAtual,
  queryParams,
  indiceAtual,
  audioUrl,
  abrirModalEditarAudio,
  abrirModalVisualizarTextoCompleto,
} = useConteudo();
const { alternarChat } = useChatIA();
const { deletarFrase, obterExplicacaoIA, criarAudioComIA, atualizarFrases } =
  useApiConteudo();

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
</style>
