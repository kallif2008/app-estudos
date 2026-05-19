import { ref } from "vue";
import { useClient } from "@/client";
import { useConteudo } from "./useConteudo";

interface Mensagem {
  papel: "user" | "assistant";
  conteudo: string;
}

const mensagens = ref<Mensagem[]>([]);
const mensagemAtual = ref("");
const enviando = ref(false);
const abrirChat = ref(false);
const { dataFrases } = useConteudo();

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
        mensagens: mensagens.value,
        contexto: dataFrases.value.frases.map((f) => f.frase).join("\n"),
      });
      mensagens.value.push({
        papel: "assistant",
        conteudo: response.data.resposta,
      });
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
