import { ref } from "vue";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import type { Agentes } from "./types";

const estadoInicial = {
  nome: "",
  modelo: "",
  sistema: "",
  assistente: "",
  chat: "",
};

const dataAgentes = ref<Agentes[]>([]);
const agentesSelect = ref<{ text: string; value: string }[]>([]);
const agente = ref({ ...estadoInicial });
const id = ref<string>("");
const tipoAcao = ref<"criar" | "editar">("criar");

const setarAgente = (
  nome: string,
  modelo: string,
  sistema: string,
  assistente: string,
  chat: string,
  _id?: string
) => {
  agente.value.nome = nome;
  agente.value.modelo = modelo;
  agente.value.sistema = sistema;
  agente.value.assistente = assistente;
  agente.value.chat = chat;
  if (_id) id.value = _id;
};

const setarEstadoInicial = () => {
  agente.value = { ...estadoInicial };
  id.value = "";
};

const modelos = [
  { text: "allam-2-7b", value: "allam-2-7b" },
  { text: "groq/compound", value: "groq/compound" },
  { text: "groq/compound-mini", value: "groq/compound-mini" },
  { text: "llama-3.1-8b-instant", value: "llama-3.1-8b-instant" },
  { text: "llama-3.3-70b-versatile", value: "llama-3.3-70b-versatile" },
  {
    text: "meta-llama/llama-4-scout-17b-16e-instruct",
    value: "meta-llama/llama-4-scout-17b-16e-instruct",
  },
  {
    text: "meta-llama/llama-prompt-guard-2-22m",
    value: "meta-llama/llama-prompt-guard-2-22m",
  },
  {
    text: "meta-llama/llama-prompt-guard-2-86m",
    value: "meta-llama/llama-prompt-guard-2-86m",
  },
  { text: "openai/gpt-oss-120b", value: "openai/gpt-oss-120b" },
  { text: "openai/gpt-oss-20b", value: "openai/gpt-oss-20b" },
  {
    text: "openai/gpt-oss-safeguard-20b",
    value: "openai/gpt-oss-safeguard-20b",
  },
  { text: "qwen/qwen3-32b", value: "qwen/qwen3-32b" },
];

const abrirModal = ref(false);

const toggleModal = (acao?: "criar" | "editar") => {
  abrirModal.value = !abrirModal.value;
  if (acao) tipoAcao.value = acao;
};

const manipularRespostaCriacaoEstudo = async (callback: () => void) => {
  useRespostaApi(201);
  await callback();
  abrirModal.value = false;
  agente.value = { ...estadoInicial };
  id.value = "";
};

export const useAgentes = () => {
  return {
    agente,
    abrirModal,
    modelos,
    dataAgentes,
    agentesSelect,
    id,
    tipoAcao,
    setarAgente,
    setarEstadoInicial,
    toggleModal,
    manipularRespostaCriacaoEstudo,
  };
};
