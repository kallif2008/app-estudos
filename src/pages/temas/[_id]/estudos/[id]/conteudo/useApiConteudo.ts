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
    manipularRespostaConteudo,
    iniciarDigitacaoIA,
    formatarRespostaIA,
    obterConteudo,
    converterParaMilissegundos,
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
      statusEstudo.value = null;
      return null;
    }
  };

  const deletarConteudoCompleto = async (idLicao: string) => {
    ativarLoading();
    await useClient.delete(`/conteudo/${idLicao}`);
    await obterStatusEstudo();
    await obterConteudo(obterFrases);
  };

  const deletarFrase = async (idFrase: string) => {
    ativarLoading();
    await useClient.delete(`/frases/${idFrase}`);
    await obterConteudo(obterFrases);
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

      manipularRespostaConteudo();
      await obterConteudo(obterFrases);
    } catch (error) {
      desativarLoading();
    }
  };

  const atualizarFrases = async () => {
    try {
      ativarLoading();
      const formData = new FormData();

      formData.append("idioma", idioma.value);

      if (fraseAtual?.value?.textoCompleto && conteudo.value.frase) {
        formData.append("textoCompleto", conteudo.value.frase);
      } else if (conteudo.value.frase) {
        formData.append("frase", conteudo.value.frase);
      }

      formData.append(
        "inicioAudio",
        String(converterParaMilissegundos(conteudo.value.inicioAudio)),
      );
      formData.append(
        "fimAudio",
        String(converterParaMilissegundos(conteudo.value.fimAudio)),
      );
      formData.append("traducao", conteudo.value.traducao || "");

      await useClient.put(`/frases/${idConteudoAtual.value}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      manipularRespostaConteudo();
      await obterConteudo(obterFrases);
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

      const texto = formatarRespostaIA(response.data.resposta || response.data);

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

    if (
      personalizarEstudo.value.gerarComIA ||
      personalizarEstudo.value.texto ||
      personalizarEstudo.value.video
    ) {
      await obterConteudo(obterFrases);
    }

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
    deletarConteudoCompleto,
  };
};
('{\n  "titulo": "Diálogo no Café (Coffee Shop)",\n  "conteudoPrincipal": "# Diálogo no Café\\n\\n**Resumo**: Emily e Jake pedem bebidas em uma cafeteria movimentada. O diálogo mostra como fazer pedidos educados, usar expressões como *Can I get…?*, *Would you like…?*, *Takeaway*, *That’s it* e despedidas como *Thanks a lot* e *Have a nice day*.\\n\\n**Vocabulário principal**\\n- *Can I get…?* – forma polida de pedir algo.\\n- *Medium latte* – latte tamanho médio.\\n- *Skim milk* – leite desnatado.\\n- *Extra syrup* – xarope extra.\\n- *Plain* – sem adição, simples.\\n- *Takeaway* – para levar.\\n- *That’s all* – só isso.\\n- *Thanks a lot* – muito obrigado(a).\\n- *Have a nice day* – tenha um bom dia.\\n- *No sugar* – sem açúcar.\\n\\n**Dicas de pronúncia** (já incluídas no material original):\\n- *Can I get* – /kæn aɪ ɡɛt/\\n- *Latte* – /ˈlɑː.teɪ/\\n- *Skim milk* – /skɪm mɪlk/\\n- *Takeaway* – /ˈteɪk.əˌweɪ/\\n- *Thanks a lot* – /θæŋks ə lɑt/\\n\\nPratique dizendo as frases devagar e depois aumente a velocidade até soar natural.",\n  "campos": {\n    "traducao": "Diálogo – No Café",\n    "gramatica": [\n      "Uso de *Can I get…?* para pedidos educados (equivalente a *May I have…?*).",\n      "Estrutura de pergunta *Would you like…?* para oferecer algo extra.",\n      "Uso de *Takeaway* como adjetivo após o pedido (ex.: *Takeaway, please*).",\n      "Frase curta *That’s all* para indicar que não quer mais nada.",\n      "Negação simples com *No sugar* (adjetivo posposto ao substantivo).",\n      "Despedidas formais informais: *Thanks a lot* e *Have a nice day*."\n    ],\n    "usoNativo": [\n      "Nativos costumam dizer *Can I get a coffee?* em vez de *May I have a coffee?* quando estão em filas.",\n      "Ao oferecer algo extra, a frase padrão é *Would you like any extra syrup?* ou *Would you like some sugar?*",\n      "Para pedidos para levar, a forma mais natural é *I’ll have it as a takeaway* ou *to go*.",\n      "Ao finalizar o pedido, *That’s it* ou *That’s all* são usados rapidamente, sem pausa.",\n      "Agradecimentos curtos como *Thanks a lot* são comuns entre amigos e também em atendimentos."\n    ],\n    "exemplos": [\n      {\n        "ingles": "Can I get a medium latte with skim milk, please?",\n        "portugues": "Posso pedir um latte médio com leite desnatado, por favor?"\n      },\n      {\n        "ingles": "Would you like any extra syrup?",\n        "portugues": "Você gostaria de algum xarope extra?"\n      },\n      {\n        "ingles": "That’s all, thank you.",\n        "portugues": "Só isso, obrigado."\n      },\n      {\n        "ingles": "I’ll have a large black coffee, no sugar, to go.",\n        "portugues": "Vou querer um café preto grande, sem açúcar, para levar."\n      },\n      {\n        "ingles": "Thanks a lot! Have a nice day!",\n        "portugues": "Muito obrigado! Tenha um bom dia!"\n      }\n    ],\n    "errosComuns": [\n      "Usar *Can I have…?* em vez de *Can I get…?* – embora correto, *Can I get* soa mais natural em cafeterias.",\n      "Dizer *Take away* como duas palavras separadas; o correto como adjetivo é *takeaway* (ou a expressão *to go*).",\n      "Pronunciar *thanks* com som de /s/ (como em “tanks”) ao invés do som /θ/ (língua entre os dentes).",\n      "Esquecer o artigo antes do tamanho: dizer *medium latte* em vez de *a medium latte*.",\n      "Confundir *plain* com *plane* – lembre‑se que *plain* significa “simples, sem adição”."\n    ],\n    "observacoes": [\n      "*Takeaway* é mais usado no Reino Unido; nos EUA costuma‑se usar *to go*.",\n      "*No sugar* pode ser dito antes ou depois do substantivo, mas a ordem mais comum é *coffee with no sugar*.",\n      "Em situações formais, prefira *May I have…?*; em contextos informais, *Can I get…?* é a escolha padrão."\n    ]\n  },\n  "tipo": "professor-ingles"\n}');
