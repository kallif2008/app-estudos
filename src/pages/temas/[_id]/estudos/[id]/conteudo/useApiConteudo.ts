import { useClient } from "@/client";
import { useConteudo } from "./useConteudo";
import type { AxiosResponse } from "axios";
import { useLoading } from "@/components/loading/useLoading";
import type { AnaliseFraseIA } from "./interfaces";

export const useApiConteudo = () => {
  const {
    idEstudoAtual,
    conteudo,
    idConteudoAtual,
    idioma,
    consultandoIA,
    statusEstudo,
    manipularRespostaCriacaoConteudo,
    iniciarDigitacaoIA,
    formatarRespostaIA,
    fraseAtual,
  } = useConteudo();

  const { ativarLoading, desativarLoading } = useLoading();

  const obterFrases = async () => {
    try {
      ativarLoading();
      const response = await useClient.get(`/frases/${idEstudoAtual.value}`);
      return response.data;
    } finally {
      desativarLoading();
    }
  };

  const obterStatusEstudo = async () => {
    try {
      const response = await useClient.get(`/status/${idEstudoAtual.value}`);

      statusEstudo.value = response.data.status;

      console.log("s", statusEstudo.value);
    } catch (error) {
      console.log("Erro ao obter status do estudo:", error);
      return null;
    }
  };

  const deletarFrase = async (idFrase: string) => {
    ativarLoading();
    await useClient.delete(`/frases/${idFrase}`);
    await manipularRespostaCriacaoConteudo(true, obterFrases);
  };

  const atualizarAudio = async () => {
    try {
      ativarLoading();
      const formData = new FormData();

      if (!conteudo.value.audio) return;

      formData.append("audio", conteudo.value.audio);

      await useClient.put(`/audios/${idEstudoAtual.value}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await manipularRespostaCriacaoConteudo(true, obterFrases);
    } catch (error) {
      desativarLoading();
    }
  };

  const atualizarFrases = async () => {
    try {
      ativarLoading();
      const formData = new FormData();

      formData.append("idioma", idioma.value);
      formData.append("frase", conteudo.value.frase);
      formData.append("inicioAudio", String(conteudo.value.inicioAudio));
      formData.append("fimAudio", String(conteudo.value.fimAudio));
      formData.append("traducao", conteudo.value.traducao || "");

      await useClient.put(`/frases/${idConteudoAtual.value}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await manipularRespostaCriacaoConteudo(true, obterFrases);
    } catch (error) {
      desativarLoading();
    }
  };

  const obterExplicacaoIA = async (frase: string) => {
    try {
      consultandoIA.value = true;
      const response: AxiosResponse<AnaliseFraseIA> = await useClient.post(
        "/ia/analisar-frase",
        { frase },
      );

      const texto = formatarRespostaIA(response.data);
      iniciarDigitacaoIA(texto, fraseAtual.value?._id || "");
    } finally {
      consultandoIA.value = false;
    }
  };

  const criarFrase = async (): Promise<AxiosResponse> => {
    const formData = new FormData();

    formData.append("idLicao", idEstudoAtual.value);
    formData.append("frase", conteudo.value.frase);

    if (conteudo.value.audio) {
      formData.append("audio", conteudo.value.audio);
    }

    const resposta: AxiosResponse = await useClient.post("/frases", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return resposta;
  };

  const carregarAudio = async (audioUrl: string) => {
    const response = await useClient.get(audioUrl, {
      responseType: "blob",
    });

    const blob = await response.data;
    return URL.createObjectURL(blob);
  };

  return {
    deletarFrase,
    atualizarFrases,
    criarFrase,
    obterFrases,
    carregarAudio,
    atualizarAudio,
    obterExplicacaoIA,
    obterStatusEstudo,
  };
};
