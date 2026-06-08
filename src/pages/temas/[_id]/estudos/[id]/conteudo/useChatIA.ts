import { ref } from "vue";
import { useClient } from "@/client";
import { useConteudo } from "./useConteudo";

interface Mensagem {
  papel: "user" | "assistant";
  conteudo: string;
  audio?: string;
}

const mensagens = ref<Mensagem[]>([]);
const mensagemAtual = ref("");
const enviando = ref(false);
const abrirChat = ref(false);
const { dataFrases, queryParams } = useConteudo();

export const useChatIA = () => {
  const enviarMensagem = async () => {
    const texto = mensagemAtual.value.trim();
    if (!texto || enviando.value) return;

    mensagens.value.push({
      papel: "user",
      conteudo: texto,
    });
    mensagemAtual.value = "";
    enviando.value = true;

    try {
      const response = await useClient.post("/ia/conversar", {
        mensagens: mensagens.value.map((m) => ({
          papel: m.papel,
          conteudo: m.conteudo,
        })),
        contexto: dataFrases.value.frases.map((f) => f.frase).join("\n"),
        idAgente: queryParams.value.agenteId,
      });
      const resposta = response.data.resposta;
      if (typeof resposta === "string") {
        mensagens.value.push({
          papel: "assistant",
          conteudo: resposta,
        });
      } else {
        mensagens.value.push({
          papel: "assistant",
          conteudo: resposta.texto,
          audio: resposta.audio,
        });
      }
    } catch {
      mensagens.value.push({
        papel: "assistant",
        conteudo: "Desculpe, ocorreu um erro ao processar sua mensagem.",
      });
    } finally {
      enviando.value = false;
    }
  };

  const limparChat = () => {
    mensagens.value = [];
  };

  const alternarChat = () => {
    abrirChat.value = !abrirChat.value;
  };

  return {
    mensagens,
    mensagemAtual,
    enviando,
    abrirChat,
    enviarMensagem,
    limparChat,
    alternarChat,
  };
};
