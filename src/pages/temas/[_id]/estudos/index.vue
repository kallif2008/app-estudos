<template>
  <ModalTema
    :titulo="tipoAcao === 'criar' ? 'Criar novo estudo' : 'Editar estudo'"
    :abrir-modal="abrirModal"
    :salvar="
      () =>
        tipoAcao === 'criar' ? criarEstudo() : atualizarEstudo(idEstudoAtual)
    "
    @fechar-modal="toggleModal()"
  >
    <FormConteudo v-model="estudo" />
  </ModalTema>

  <div class="relative min-h-screen overflow-hidden">
    <!-- background -->
    <img
      src="/fundoLogin.png"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <div class="absolute inset-0 bg-[#020617]/75" />

    <div class="relative z-10 max-w-5xl mx-auto px-6 py-10">
      <!-- topo -->
      <div class="flex sm:flex-col justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Seus estudos</h1>

          <p class="text-slate-400 mt-1">Organize sua evolução</p>
        </div>

        <div class="flex gap-2 h-12">
          <button
            @click="toggleModal('criar')"
            class="px-5 rounded-xl font-medium bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black shadow-[0_0_20px_rgba(34,211,238,.3)] hover:scale-105 transition"
          >
            + Novo estudo
          </button>

          <button
            @click="router.back()"
            class="px-5 rounded-xl border border-cyan-500/20 text-slate-300 hover:bg-slate-800 transition"
          >
            Voltar
          </button>
        </div>
      </div>

      <!-- filtros -->
      <div class="flex flex-wrap gap-3 mb-6">
        <button
          v-for="item in filtroEstudo"
          :key="item.id"
          @click="
            () => {
              idBtnStatusEstudo = item.id;
              buscarEstudos(item.value);
            }
          "
          :class="[
            'px-4 py-2 rounded-xl transition',
            idBtnStatusEstudo === item.id
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,.3)]'
              : 'bg-[#081121]/90 text-slate-400 hover:bg-slate-800',
          ]"
        >
          {{ item.label }}
        </button>
      </div>

      <SemConteudo
        v-if="dataEstudos.length === 0"
        :fn="() => toggleModal('criar')"
        label="Criar novo estudo"
        texto="Crie um estudo para começar"
        titulo="Nenhum estudo encontrado"
        :mostrarBotao="false"
      />

      <!-- cards -->
      <div class="grid gap-4">
        <div
          v-for="estudo in dataEstudos"
          :key="estudo._id"
          class="rounded-2xl p-[2px] bg-gradient-to-r from-cyan-500/50 to-fuchsia-500/50"
        >
          <div class="rounded-2xl bg-[#081121]/90 backdrop-blur-lg p-5">
            <!-- topo card -->

            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-lg font-semibold text-white">
                  {{ estudo.titulo }}
                </h2>

                <p class="text-slate-400 mt-1">
                  {{ estudo.descricao }}
                </p>

                <div class="flex items-center gap-2 mt-1 text-white">
                  Agente:
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/70 text-cyan-300 border border-cyan-500/20"
                  >
                    {{ estudo.nomeAgente }}
                  </span>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  class="action-button"
                  @click="
                    router.push(
                      `/temas/${idTemaAtual}/estudos/${estudo._id}/conteudo?agenteId=${estudo.idAgente}&agenteIdExplicacao=${estudo.idAgenteExplicacao}&tradutor=${estudo.tradutor}`,
                    )
                  "
                >
                  <svg-icon type="mdi" :path="mdiMagnify" class="w-5 h-5" />
                </button>

                <button
                  class="action-button"
                  @click="
                    () => {
                      setarEstudo(
                        estudo.titulo,
                        estudo.descricao,
                        estudo.tradutor,
                        estudo.idAgente,
                        estudo._id,
                        estudo.idAgenteExplicacao,
                      );
                      toggleModal('editar');
                    }
                  "
                >
                  <svg-icon type="mdi" :path="mdiPencil" class="w-5 h-5" />
                </button>

                <button
                  class="action-button hover:text-red-400"
                  @click="deletarEstudo(estudo._id)"
                >
                  <svg-icon
                    type="mdi"
                    :path="mdiTrashCanOutline"
                    class="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            <!-- footer -->

            <div
              class="mt-5 pt-4 border-t border-slate-800 flex sm:flex-col gap-4 justify-between"
            >
              <div class="flex items-center gap-2">
                <span class="text-slate-400"> Status: </span>

                <Badge
                  :status="
                    estudo.status === 'estudando'
                      ? 'info'
                      : estudo.status === 'revisao'
                        ? 'warn'
                        : 'success'
                  "
                >
                  {{
                    estudo.status === "estudando"
                      ? "Estudando"
                      : estudo.status === "revisao"
                        ? "Revisão"
                        : "Concluído"
                  }}
                </Badge>
              </div>

              <button
                class="px-4 py-2 rounded-xl text-sm bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition"
                @click="
                  atualizarStatusEstudo(
                    estudo._id,
                    estudo.status === 'estudando'
                      ? 'revisao'
                      : estudo.status === 'revisao'
                        ? 'concluidos'
                        : 'estudando',
                  )
                "
              >
                Mudar para
                {{
                  estudo.status === "estudando"
                    ? "Revisão"
                    : estudo.status === "revisao"
                      ? "Concluídos"
                      : "Estudando"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

<route lang="json">
{
  "meta": {
    "title": "temas-uuid",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import { onMounted } from "vue";
import ModalTema from "@/components/modal/index.vue";
import SemConteudo from "@/components/semConteudo/index.vue";
import FormConteudo from "@/components/formConteudo/index.vue";
import { useEstudos } from "./useEstudos";
import { useApiEstudos } from "./useApiEstudos";
import { useRoute } from "vue-router";
import { useModal } from "@/components/modal/useModal";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import { useRouter } from "vue-router";
import Badge from "@/components/badge/index.vue";
import { useConteudo } from "./[id]/conteudo/useConteudo";
import { useApiAgentes } from "@/pages/agentes/useApiAgentes";

defineProps<{
  _id: string;
}>();

const router = useRouter();
const route = useRoute();

const { abrirModal, tipoAcao, toggleModal } = useModal();
const { listarAgentesSelect } = useApiAgentes();
const {
  dataEstudos,
  idTemaAtual,
  filtroEstudo,
  estudo,
  idEstudoAtual,
  idBtnStatusEstudo,
  setarEstudo,
} = useEstudos();
const {
  buscarEstudos,
  criarEstudo,
  atualizarEstudo,
  deletarEstudo,
  atualizarStatusEstudo,
} = useApiEstudos();

const { statusEstudo } = useConteudo();

onMounted(async () => {
  idBtnStatusEstudo.value = 1;

  idTemaAtual.value = route.params._id as string;
  statusEstudo.value = null;

  await Promise.all([buscarEstudos(), listarAgentesSelect()]);
});
</script>
