import { computed, ref, watch } from "vue";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useModal } from "@/components/modal/useModal";
import { useLoading } from "@/components/loading/useLoading";
import type { AnaliseFraseIA, IFrases, IRespostaFrases } from "./interfaces";
import type { AxiosResponse } from "node_modules/axios/index.d.cts";

const { ativarLoading, desativarLoading } = useLoading();
const { abrirModal } = useModal();
const dataFrases = ref<IRespostaFrases>({ frases: [], audioUrl: null });
const idEstudoAtual = ref<string>("");
const tipoAcao = ref<"criar" | "editar">("criar");
const idConteudoAtual = ref<string>("");
const audioComIa = ref<Record<number, string>>({});
const queryParams = ref({
  agenteId: "",
  agenteIdExplicacao: "",
  tradutor: false,
});
const conteudo = ref<{
  frase?: string | null;
  inicioAudio: number | string;
  fimAudio: number | string;
  audio: File | null;
  traducao?: string | null;
  videoUrl: string | null;
}>({
  frase: null,
  audio: null,
  inicioAudio: 0,
  fimAudio: 0,
  traducao: null,
  videoUrl: null,
});

const showLoading = ref(false);
const audioUrl = ref<string | null>(null);
const audioLoading = ref(false);
const abrirModalEditarAudio = ref(false);
const idioma = ref<"pt" | "en">("pt");
const indiceAtual = ref(0);
const abrirModalVisualizarTextoCompleto = ref(false);
const consultandoIA = ref(false);
const textoDigitacaoIA = ref("");
const isDigitandoIA = ref(false);
const respostasIA = ref<Record<string, string>>({});
const statusEstudo = ref<string | null>("");
const personalizarEstudo = ref({
  texto: false,
  audio: false,
  video: false,
  extrairTextoAudio: false,
  converterTextoFrases: false,
  gerarComIA: false,
  gerarAudioComIA: false,
});

const iniciarDigitacaoIA = (texto: string, fraseId: string) => {
  textoDigitacaoIA.value = "";
  isDigitandoIA.value = true;
  let charIndex = 0;

  const digitar = () => {
    if (charIndex < texto.length) {
      textoDigitacaoIA.value += texto[charIndex];
      charIndex++;
      setTimeout(digitar, 10);
    } else {
      isDigitandoIA.value = false;
      respostasIA.value[fraseId] = texto;
    }
  };

  digitar();
};

function formatarRespostaIA(data: any): string {
  if (!data) return "Sem resposta.";

  if (typeof data === "string") return data;

  let texto = data.titulo ? `**${data.titulo}**\n\n` : "";

  if (data.campos) {
    Object.entries(data.campos).forEach(([chave, valor]) => {
      if (!valor || chave === "tipo") return;
      const titulo = chave.charAt(0).toUpperCase() + chave.slice(1);
      texto += `**${titulo}**\n${formatarValor(valor)}\n\n`;
    });
  }

  return texto.trim() || JSON.stringify(data, null, 2);
}

function formatarValor(valor: any): string {
  if (Array.isArray(valor)) {
    return valor
      .map(
        (item) => `• ${typeof item === "string" ? item : JSON.stringify(item)}`,
      )
      .join("\n");
  }
  if (typeof valor === "object") {
    return "```json\n" + JSON.stringify(valor, null, 2) + "\n```";
  }
  return String(valor);
}

const setarInfoParaEditarConteudo = (item: IFrases) => {
  idConteudoAtual.value = item._id;
  conteudo.value.frase = item.frase || item.textoCompleto;
  conteudo.value.inicioAudio = item.inicioAudio;
  conteudo.value.fimAudio = item.fimAudio;
  conteudo.value.traducao = item.traducao || "";
};

const toggleModal = (
  acao: "criar" | "editar",
  idConteudo?: string,
  texto?: string,
) => {
  abrirModal.value = !abrirModal.value;
  tipoAcao.value = acao;
  if (idConteudo) idConteudoAtual.value = idConteudo;

  if (acao === "editar") conteudo.value.frase = texto || "";
};

const obterConteudo = async (obterFrases: () => Promise<IRespostaFrases>) => {
  const frases = await obterFrases();
  dataFrases.value = frases;
};

const criarConteudo = async (
  criarFrase: () => Promise<AxiosResponse>,
  obterStatus: () => Promise<null | undefined>,
) => {
  try {
    ativarLoading();

    await Promise.all([criarFrase(), obterStatus()]);

    manipularRespostaConteudo();
  } catch (error) {
    desativarLoading();
  }
};

const manipularRespostaConteudo = () => {
  abrirModal.value = false;

  useRespostaApi(201);

  conteudo.value = {
    frase: null,
    inicioAudio: 0,
    fimAudio: 0,
    audio: null,
    videoUrl: null,
  };

  desativarLoading();
};

const selecionarAudio = (event: File) => {
  const file = event;

  if (!file) return;

  conteudo.value.audio = file;
};

function formatarDialogo(texto: string) {
  if (!texto) return "";

  const comQuebras = texto.replace(/([.!?])\s+/g, "$1\n");

  const linhas = comQuebras
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const resultado = [];
  for (let i = 0; i < linhas.length; i++) {
    resultado.push(linhas[i]);

    if ((i + 1) % 2 === 0) {
      resultado.push("");
    }
  }

  return resultado.join("\n");
}

const fraseAtual = computed(() => {
  return dataFrases.value.frases[indiceAtual.value];
});

const proximoCard = () => {
  if (indiceAtual.value < dataFrases.value.frases.length - 1) {
    indiceAtual.value++;
  }
};

const cardAnterior = () => {
  if (indiceAtual.value > 0) {
    indiceAtual.value--;
  }
};

watch(fraseAtual, (novaFrase) => {
  if (!novaFrase) {
    textoDigitacaoIA.value = "";
    return;
  }
  if (respostasIA.value[novaFrase._id]) {
    textoDigitacaoIA.value = respostasIA.value[novaFrase._id] ?? "";
    isDigitandoIA.value = false;
  } else {
    textoDigitacaoIA.value = "";
  }
});

const converterParaMilissegundos = (valor?: number | string): number => {
  if (valor === undefined) return 0;

  if (typeof valor === "string" && valor.includes(":")) {
    const [horas = 0, minutos = 0, segundos = 0] = valor.split(":").map(Number);
    return (horas * 3600 + minutos * 60 + segundos) * 1000;
  }
  return Number(valor);
};

export const useConteudo = () => {
  return {
    dataFrases,
    idEstudoAtual,
    conteudo,
    tipoAcao,
    idConteudoAtual,
    audioUrl,
    audioLoading,
    abrirModalEditarAudio,
    idioma,
    indiceAtual,
    fraseAtual,
    abrirModalVisualizarTextoCompleto,
    consultandoIA,
    textoDigitacaoIA,
    isDigitandoIA,
    respostasIA,
    personalizarEstudo,
    queryParams,
    audioComIa,
    statusEstudo,
    showLoading,
    setarInfoParaEditarConteudo,
    formatarDialogo,
    formatarRespostaIA,
    iniciarDigitacaoIA,
    criarConteudo,
    selecionarAudio,
    obterConteudo,
    toggleModal,
    manipularRespostaConteudo,
    proximoCard,
    cardAnterior,
    converterParaMilissegundos,
  };
};
