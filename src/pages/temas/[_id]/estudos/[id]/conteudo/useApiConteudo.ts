import { useClient } from "@/client";
import { useConteudo } from "./useConteudo";
import type { AxiosResponse } from "axios";
import { useLoading } from "@/components/loading/useLoading";

export const useApiConteudo = () => {
  const {
    idEstudoAtual,
    conteudo,
    idConteudoAtual,
    idioma,
    consultandoIA,
    statusEstudo,
    fraseAtual,
    personalizarEstudo,
    queryParams,
    audioComIa,
    manipularRespostaCriacaoConteudo,
    iniciarDigitacaoIA,
    formatarRespostaIA,
  } = useConteudo();

  const { ativarLoading, desativarLoading } = useLoading();

  const obterFrases = async () => {
    const response = await useClient.get(`/frases/${idEstudoAtual.value}`);
    return response.data;
  };

  const obterStatusEstudo = async () => {
    try {
      const response = await useClient.get(`/status/${idEstudoAtual.value}`);

      statusEstudo.value = response.data.status;
    } catch (error) {
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
      if (!conteudo.value.frase) return;
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

  const obterExplicacaoIA = async (frase: string, idAgente: string) => {
    try {
      consultandoIA.value = true;
      const response: AxiosResponse = await useClient.post(
        "/ia/analisar-frase",
        { frase, idAgente },
      );

      console.log("texto", response);
      const texto = formatarRespostaIA(response.data);

      iniciarDigitacaoIA(texto, fraseAtual.value?._id || "");
    } finally {
      consultandoIA.value = false;
    }
  };

  const criarFrase = async (): Promise<AxiosResponse> => {
    const formData = new FormData();

    formData.append("idLicao", idEstudoAtual.value);

    if (conteudo.value.frase && personalizarEstudo.value.texto) {
      formData.append("frase", conteudo.value.frase);
    }

    if (conteudo.value.audio && personalizarEstudo.value.audio) {
      formData.append("audio", conteudo.value.audio);
    }

    if (conteudo.value.videoUrl && personalizarEstudo.value.video) {
      formData.append("videoUrl", conteudo.value.videoUrl);
    }

    formData.append(
      "gerarComIA",
      personalizarEstudo.value.gerarComIA ? "true" : "false",
    );

    formData.append(
      "converterTextoFrases",
      personalizarEstudo.value.converterTextoFrases ? "true" : "false",
    );

    formData.append(
      "extrairTextoAudio",
      personalizarEstudo.value.extrairTextoAudio ? "true" : "false",
    );

    formData.append("idAgente", queryParams.value.agenteId || "");
    formData.append(
      "gerarAudioComIA",
      personalizarEstudo.value.gerarAudioComIA ? "true" : "false",
    );

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

  const criarAudioComIA = async (texto: string, index: number) => {
    const response = await useClient.post("/ia/criar-audio", { texto });
    audioComIa.value[index] = response.data;
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
    criarAudioComIA,
  };
};
