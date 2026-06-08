<template>
  <ModalEstudos
    :abrir-modal="abrirModal"
    :salvar="() => (tipoAcao === 'criar' ? criarTema() : atualizarTema(id))"
    @fechar-modal="toggleModal()"
  >
    <FormConteudo
      :titulo="tipoAcao === 'criar' ? 'Criar novo tema' : 'Editar tema'"
      v-model="conteudo"
    />
  </ModalEstudos>

  <div class="relative min-h-screen overflow-hidden w-full">
    <!-- background -->
    <img
      src="/fundoLogin.png"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <div class="absolute inset-0 bg-[#020617]/70"></div>

    <div class="relative z-10 px-6 py-10 max-w-5xl mx-auto">
      <SemConteudo
        v-if="dataTemas.length === 0"
        :fn="() => toggleModal('criar')"
        label="Criar novo tema"
        texto="Crie um novo tema para começar seus estudos."
        titulo="Nenhum tema encontrado"
      />

      <template v-else>
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">Seus temas</h1>

            <p class="text-slate-400 mt-1">Organize seus estudos</p>
          </div>

          <button
            @click="
              () => {
                toggleModal('criar');
                setarEstadoInicial();
              }
            "
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-semibold shadow-[0_0_20px_rgba(34,211,238,.35)] hover:scale-105 transition"
          >
            + Novo tema
          </button>
        </div>

        <div class="grid gap-4">
          <div
            v-for="tema in dataTemas"
            :key="tema._id"
            class="p-[2px] rounded-2xl bg-gradient-to-r from-cyan-500/50 to-fuchsia-500/50"
          >
            <div
              class="rounded-2xl bg-[#081121]/90 backdrop-blur-lg p-5 flex justify-between items-center transition hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(34,211,238,.15)]"
            >
              <div>
                <h2 class="text-white font-semibold text-lg">
                  {{ tema.titulo }}
                </h2>

                <p class="text-slate-400 mt-1">
                  {{ tema.descricao }}
                </p>
              </div>

              <div class="flex gap-2">
                <button
                  @click="router.push(`/temas/${tema._id}/estudos`)"
                  class="action-button"
                >
                  <svg-icon type="mdi" :path="mdiMagnify" class="w-5 h-5" />
                </button>

                <button
                  @click="
                    toggleModal('editar');
                    setarTema(tema.titulo, tema.descricao, tema._id);
                  "
                  class="action-button"
                >
                  <svg-icon type="mdi" :path="mdiPencil" class="w-5 h-5" />
                </button>

                <button
                  @click="deletarTema(tema._id)"
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
          </div>
        </div>
      </template>
    </div>
  </div>
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
import ModalEstudos from "@/components/modal/index.vue";
import { useTemas } from "./useTemas";
import FormConteudo from "@/components/formConteudo/index.vue";
import { onMounted } from "vue";
import { useApiTemas } from "./useApiTemas";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import { useRouter } from "vue-router";
import SemConteudo from "@/components/semConteudo/index.vue";
import { useModal } from "@/components/modal/useModal";

const router = useRouter();
const { dataTemas, conteudo, id, setarTema, setarEstadoInicial } = useTemas();
const { obterTemas, criarTema, deletarTema, atualizarTema } = useApiTemas();
const { abrirModal, tipoAcao, toggleModal } = useModal();

onMounted(async () => {
  await obterTemas();
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
