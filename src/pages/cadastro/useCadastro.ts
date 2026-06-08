import { ref, computed } from "vue";

const usuario = ref({
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
});

const showSenha = ref(false);
const showConfirmarSenha = ref(false);
const loading = ref(false);
const erros = ref({
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
});

const toggleShowSenha = () => {
  showSenha.value = !showSenha.value;
};

const toggleShowConfirmarSenha = () => {
  showConfirmarSenha.value = !showConfirmarSenha.value;
};

const validarSenha = (senha: string): boolean => {
  if (senha.length < 6) return false;
  if (!/[A-Z]/.test(senha)) return false;
  if (!/\d/.test(senha)) return false;
  if (!/[^a-zA-Z0-9]/.test(senha)) return false;

  for (const char of senha) {
    if (/[a-z]/.test(char)) continue;
    if (/[A-Z]/.test(char)) continue;
    if (/\d/.test(char)) continue;
    if (/[^a-zA-Z0-9]/.test(char)) continue;
    return false;
  }

  return true;
};

const formularioValido = computed(() => {
  return (
    usuario.value.nome.trim() !== "" &&
    usuario.value.email.trim() !== "" &&
    validarSenha(usuario.value.senha) &&
    usuario.value.senha === usuario.value.confirmarSenha
  );
});

const validar = () => {
  erros.value.nome = !usuario.value.nome.trim() ? "Nome é obrigatório" : "";

  erros.value.email = !usuario.value.email.trim()
    ? "Email é obrigatório"
    : "";

  if (!usuario.value.senha) {
    erros.value.senha = "Senha é obrigatória";
  } else if (!validarSenha(usuario.value.senha)) {
    erros.value.senha =
      "A senha deve ter no mínimo 6 caracteres, com pelo menos uma letra maiúscula, um número e um caractere especial";
  } else {
    erros.value.senha = "";
  }

  erros.value.confirmarSenha =
    usuario.value.senha !== usuario.value.confirmarSenha
      ? "As senhas não conferem"
      : "";
};

const limparErros = () => {
  erros.value = { nome: "", email: "", senha: "", confirmarSenha: "" };
};

export function useCadastro() {
  return {
    usuario,
    showSenha,
    showConfirmarSenha,
    loading,
    erros,
    formularioValido,
    toggleShowSenha,
    toggleShowConfirmarSenha,
    validar,
    limparErros,
    validarSenha,
  };
}
