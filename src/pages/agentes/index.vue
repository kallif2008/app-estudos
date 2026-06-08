<template>
  <div>
    <Modal
      :abrir-modal="abrirModal"
      :salvar="
        () => (tipoAcao === 'criar' ? criarAgente() : atualizarAgente(id))
      "
      @fechar-modal="
        toggleModal();
        setarEstadoInicial();
      "
      :titulo="tipoAcao === 'criar' ? 'Criar novo agente' : 'Editar agente'"
      :subtitulo="
        tipoAcao === 'criar'
          ? 'Preencha as informações abaixo para criar um novo agente.'
          : 'Altere as informações do agente.'
      "
    >
      <Select
        label="Modelos"
        placeholder="Selecione um modelo"
        :items="modelos"
        v-model="agente.modelo"
      />

      <Input
        label="Nome do agente"
        placeholder="Digite o nome do agente"
        v-model="agente.nome"
      />

      <Textarea
        id="agente"
        label="Prompt para o agente"
        placeholder="Digite o prompt para o agente"
        v-model="agente.sistema"
      />

      <Textarea
        id="assistente"
        label="Prompt para o assistente"
        placeholder="Digite o prompt para o assistente"
        v-model="agente.assistente"
      />

      <Textarea
        id="chat"
        label="Prompt para o chat"
        placeholder="Digite o prompt para o chat"
        v-model="agente.chat"
      />
    </Modal>

    <div class="relative min-h-screen overflow-hidden w-full">
      <img
        src="/fundoLogin.png"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="absolute inset-0 bg-[#020617]/70" />

      <div class="relative z-10 px-6 py-10 max-w-5xl mx-auto">
        <div class="flex sm:flex-col justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-bold text-white">Seus agentes</h1>

            <p class="text-slate-400 mt-1">Gerencie seus agentes de IA</p>
          </div>

          <div class="flex gap-2 h-12">
            <button
              @click="
                toggleModal('criar');
                setarEstadoInicial();
              "
              class="px-5 rounded-xl font-medium bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black shadow-[0_0_20px_rgba(34,211,238,.3)] hover:scale-105 transition"
            >
              + Novo agente
            </button>

            <button
              @click="router.back()"
              class="px-5 rounded-xl border border-cyan-500/20 text-slate-300 hover:bg-slate-800 transition"
            >
              Voltar
            </button>
          </div>
        </div>

        <SemConteudo
          v-if="dataAgentes.length === 0"
          :fn="
            () => {
              toggleModal('criar');
              setarEstadoInicial();
            }
          "
          label="Criar novo agente"
          texto="Crie um novo agente para começar."
          titulo="Nenhum agente encontrado"
        />

        <div v-else class="grid gap-4">
          <div
            v-for="agente in dataAgentes"
            :key="agente._id"
            class="p-[2px] rounded-2xl bg-gradient-to-r from-cyan-500/50 to-fuchsia-500/50"
          >
            <div
              class="rounded-2xl bg-[#081121]/90 backdrop-blur-lg p-5 transition hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(34,211,238,.15)]"
            >
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="min-w-0">
                  <h2 class="text-white font-semibold text-lg truncate">
                    {{ agente.nome }}
                  </h2>

                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/70 text-cyan-300 border border-cyan-500/20"
                    >
                      {{ agente.modelo }}
                    </span>
                  </div>
                </div>

                <div class="flex gap-2 shrink-0">
                  <button
                    @click="
                      toggleModal('editar');
                      setarAgente(
                        agente.nome,
                        agente.modelo,
                        agente.sistema,
                        agente.assistente,
                        agente.chat,
                        agente._id,
                      );
                    "
                    class="action-button"
                  >
                    <svg-icon type="mdi" :path="mdiPencil" class="w-5 h-5" />
                  </button>

                  <button
                    @click="deletarAgente(agente._id)"
                    class="action-button hover:text-red-400"
                  >
                    <svg-icon
                      type="mdi"
                      :path="mdiTrashCanOutline"
                      class="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              <div
                class="rounded-xl bg-slate-800/30 backdrop-blur-sm divide-y divide-cyan-500/5"
              >
                <Collapse title="Sistema">
                  {{ agente.sistema }}
                </Collapse>

                <Collapse title="Assistente">
                  {{ agente.assistente }}
                </Collapse>

                <Collapse title="Chat">
                  {{ agente.chat }}
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "agentes",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useRouter } from "vue-router";
import Modal from "@/components/modal/index.vue";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Collapse from "@/components/collapse/index.vue";
import { useAgentes } from "./useAgentes";
import { useApiAgentes } from "./useApiAgentes";
import { onMounted } from "vue";
import Textarea from "@/components/textarea/index.vue";

const router = useRouter();
const {
  agente,
  modelos,
  abrirModal,
  toggleModal,
  dataAgentes,
  id,
  tipoAcao,
  setarAgente,
  setarEstadoInicial,
} = useAgentes();
const { criarAgente, listarAgentes, deletarAgente, atualizarAgente } =
  useApiAgentes();

onMounted(async () => {
  await listarAgentes();
});
</script>

<style scoped>
.action-button {
  @apply h-10
  w-10
  rounded-full
  bg-slate-800/60
  text-slate-300
  flex
  items-center
  justify-center
  hover:bg-cyan-500/20
  hover:text-cyan-300
  transition;
}
</style>
