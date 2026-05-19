<template>
  <div
    class="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4"
  >
    <!-- Background -->
    <img
      src="/fundoLogin.png"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Overlay escuro -->
    <div class="absolute inset-0 bg-[#020617]/55 backdrop-blur-[2px]" />

    <!-- Card -->
    <div
      class="relative z-10 w-full max-w-md p-[2px] rounded-[30px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
    >
      <div class="rounded-[30px] bg-[#081121]/85 backdrop-blur-xl px-8 py-10">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <img src="/memora-logo.png" alt="Memora" class="w-48 mb-3" />

          <p class="text-slate-300 text-sm">
            Aprenda melhor. Lembre por mais tempo.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="login">
          <!-- email -->
          <div class="space-y-2">
            <label class="text-sm text-slate-300"> E-mail </label>

            <div
              class="rounded-xl p-[2px] bg-gradient-to-r from-cyan-500/70 to-fuchsia-500/70"
            >
              <Input
                v-model="usuario.email"
                type="email"
                placeholder="seu@email.com"
                class="bg-[#0F172A]/90 rounded-xl"
              />
            </div>
          </div>

          <!-- senha -->
          <div class="space-y-2">
            <label class="text-sm text-slate-300"> Senha </label>

            <div
              class="rounded-xl p-[1px] bg-gradient-to-r from-cyan-500/70 to-fuchsia-500/70"
            >
              <Input
                v-model="usuario.senha"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="bg-[#0F172A]/90 rounded-xl"
              >
                <template #trailing>
                  <button
                    type="button"
                    @click="togglePassword"
                    class="text-slate-400 hover:text-cyan-400 transition"
                  >
                    <span v-if="showPassword"> 🙈 </span>

                    <span v-else> 👁️ </span>
                  </button>
                </template>
              </Input>
            </div>
          </div>

          <!-- botão principal -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 rounded-xl font-medium text-black bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
          >
            {{ loading ? "Entrando..." : "Entrar" }}
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
          >
            Criar conta
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<route lang="json">
{
  "meta": {
    "title": "login",
    "layout": "Auth",
    "auth": false
  }
}
</route>

<script setup lang="ts">
import Input from "@/components//input/index.vue";
import { useLogin } from "./useLogin";
import { useApiLogin } from "./useApiLogin";

const { usuario, showPassword, loading, togglePassword } = useLogin();
const { login } = useApiLogin();
</script>
