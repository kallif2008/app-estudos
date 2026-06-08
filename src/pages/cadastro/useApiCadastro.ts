import { useCadastro } from "./useCadastro";
import { useClient } from "@/client/index";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

export const useApiCadastro = () => {
  const { usuario, loading } = useCadastro();

  const cadastrar = async () => {
    loading.value = true;

    try {
      const resposta = await useClient.post("/register", {
        nome: usuario.value.nome,
        email: usuario.value.email,
        senha: usuario.value.senha,
      });

      if (resposta.status === 201) {
        useRespostaApi(201);

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    cadastrar,
  };
};
