import { useAgentes } from "./useAgentes";
import { useClient } from "@/client/index";

export const useApiAgentes = () => {
  const { agente, dataAgentes, agentesSelect, manipularRespostaCriacaoEstudo } =
    useAgentes();

  const listarAgentes = async () => {
    const resposta = await useClient("/agentes", {
      method: "get",
    });

    dataAgentes.value = resposta.data;
  };

  const criarAgente = async () => {
    await useClient("/agentes", {
      data: agente.value,
      method: "post",
    });

    await manipularRespostaCriacaoEstudo(listarAgentes);
  };

  const listarAgentesSelect = async () => {
    const resposta = await useClient("/agentes/resumo", {
      method: "get",
    });

    const agentes = resposta.data as { _id: string; nome: string }[];

    agentesSelect.value = agentes.map((agente) => ({
      text: agente.nome,
      value: agente._id,
    }));
  };

  const deletarAgente = async (idAgente: string) => {
    await useClient(`/agentes/${idAgente}`, { method: "delete" });
    await listarAgentes();
  };

  const atualizarAgente = async (idAgente: string) => {
    await useClient(`/agentes/${idAgente}`, {
      data: agente.value,
      method: "put",
    });

    await manipularRespostaCriacaoEstudo(listarAgentes);
  };

  return { criarAgente, listarAgentes, listarAgentesSelect, deletarAgente, atualizarAgente };
};
