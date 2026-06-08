<template>
  <div
    class="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4"
  >
    <img
      src="/fundoLogin.png"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
    />

    <div class="absolute inset-0 bg-[#020617]/55 backdrop-blur-[2px]" />

    <div
      class="relative z-10 w-full max-w-md p-[2px] rounded-[30px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
    >
      <div class="rounded-[30px] bg-[#081121]/85 backdrop-blur-xl px-8 py-10">
        <div class="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Memora" class="w-48 mb-3" />

          <p class="text-slate-300 text-sm">
            Crie sua conta e comece a aprender.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- nome -->
          <div class="space-y-1">
            <label class="text-sm text-slate-300"> Nome </label>

            <div
              class="rounded-xl p-[2px] bg-gradient-to-r from-cyan-500/70 to-fuchsia-500/70"
            >
              <Input
                v-model="usuario.nome"
                type="text"
                placeholder="Seu nome"
              />
            </div>

            <p v-if="erros.nome" class="text-xs text-red-400 px-1">
              {{ erros.nome }}
            </p>
          </div>

          <!-- email -->
          <div class="space-y-1">
            <label class="text-sm text-slate-300"> E-mail </label>

            <div
              class="rounded-xl p-[2px] bg-gradient-to-r from-cyan-500/70 to-fuchsia-500/70"
            >
              <Input
                v-model="usuario.email"
                type="email"
                placeholder="seu@email.com"
              />
            </div>

            <p v-if="erros.email" class="text-xs text-red-400 px-1">
              {{ erros.email }}
            </p>
          </div>

          <!-- senha -->
          <div class="space-y-1">
            <label class="text-sm text-slate-300"> Senha </label>

            <div
              class="rounded-xl p-[1px] bg-gradient-to-r from-cyan-500/70 to-fuchsia-500/70"
            >
              <Input
                v-model="usuario.senha"
                :type="showSenha ? 'text' : 'password'"
                placeholder="••••••••"
              >
                <template #trailing>
                  <button
                    type="button"
                    @click="toggleShowSenha"
                    class="text-slate-400 hover:text-cyan-400 transition"
                  >
                    <span v-if="showSenha"> 🙈 </span>

                    <span v-else> 👁️ </span>
                  </button>
                </template>
              </Input>
            </div>

            <p v-if="erros.senha" class="text-xs text-red-400 px-1">
              {{ erros.senha }}
            </p>
          </div>

          <!-- confirmar senha -->
          <div class="space-y-1">
            <label class="text-sm text-slate-300"> Confirmar senha </label>

            <div
              class="rounded-xl p-[1px] bg-gradient-to-r from-cyan-500/70 to-fuchsia-500/70"
            >
              <Input
                v-model="usuario.confirmarSenha"
                :type="showConfirmarSenha ? 'text' : 'password'"
                placeholder="••••••••"
              >
                <template #trailing>
                  <button
                    type="button"
                    @click="toggleShowConfirmarSenha"
                    class="text-slate-400 hover:text-cyan-400 transition"
                  >
                    <span v-if="showConfirmarSenha"> 🙈 </span>

                    <span v-else> 👁️ </span>
                  </button>
                </template>
              </Input>
            </div>

            <p v-if="erros.confirmarSenha" class="text-xs text-red-400 px-1">
              {{ erros.confirmarSenha }}
            </p>
          </div>

          <!-- botão principal -->
          <button
            type="submit"
            :disabled="loading || !formularioValido"
            class="w-full h-12 rounded-xl font-medium text-black bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {{ loading ? "Cadastrando..." : "Cadastrar" }}
          </button>

          <!-- divider -->
          <div class="flex items-center gap-3">
            <div
              class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"
            />

            <span class="text-xs text-slate-500"> ou </span>

            <div
              class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"
            />
          </div>

          <!-- botão secundário -->
          <button
            type="button"
            class="w-full h-12 rounded-xl border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,.2)] transition"
            @click="irParaLogin"
          >
            Já tenho conta
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "cadastro",
    "layout": "Auth",
    "auth": false
  }
}
</route>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Input from "@/components/input/index.vue";
import { useCadastro } from "./useCadastro";
import { useApiCadastro } from "./useApiCadastro";

const router = useRouter();
const { usuario, showSenha, showConfirmarSenha, loading, erros, formularioValido, toggleShowSenha, toggleShowConfirmarSenha, validar, limparErros } = useCadastro();
const { cadastrar } = useApiCadastro();

const handleSubmit = () => {
  validar();

  if (formularioValido.value) {
    cadastrar();
  }
};

const irParaLogin = () => {
  limparErros();
  router.push("/login");
};
</script>
