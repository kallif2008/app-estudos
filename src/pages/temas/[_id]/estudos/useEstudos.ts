import { ref } from "vue";
import type { IEstudos } from "./interfaces";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useModal } from "@/components/modal/useModal";

const { abrirModal } = useModal();
const dataEstudos = ref<IEstudos[]>([]);
const idTemaAtual = ref<string>("");
const idEstudoAtual = ref<string>("");
const idBtnStatusEstudo = ref<number>(1);
const estudo = ref<{
  titulo: string;
  descricao: string;
  agenteId: string;
  tradutor: boolean;
  agenteIdExplicacao?: string;
}>({
  titulo: "",
  descricao: "",
  agenteId: "",
  tradutor: false,
  agenteIdExplicacao: "",
});

const filtroEstudo = [
  { label: "Estudando", value: "estudando", id: 1 },
  { label: "Para revisar", value: "revisao", id: 2 },
  { label: "Concluídos", value: "concluidos", id: 3 },
];

const manipularRespostaCriacaoEstudo = async (callback: () => void) => {
  useRespostaApi(201);
  await callback();
  abrirModal.value = false;
  estudo.value = { titulo: "", descricao: "", agenteId: "", tradutor: false };
  idEstudoAtual.value = "";
};

const setarEstudo = (
  titulo: string,
  descricao: string,
  tradutor: boolean,
  agenteId: string,
  id?: string,
  agenteIdExplicacao?: string,
) => {
  estudo.value.titulo = titulo;
  estudo.value.descricao = descricao;
  estudo.value.agenteId = agenteId;
  estudo.value.tradutor = tradutor;
  estudo.value.agenteIdExplicacao = agenteIdExplicacao;

  if (id) idEstudoAtual.value = id;
};

export const useEstudos = () => {
  return {
    dataEstudos,
    idTemaAtual,
    idEstudoAtual,
    estudo,
    filtroEstudo,
    idBtnStatusEstudo,
    setarEstudo,
    manipularRespostaCriacaoEstudo,
  };
};
