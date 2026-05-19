type IFrases = {
  frase: string;
  inicioAudio: number;
  fimAudio: number;
  _id: string;
  idEstudo: string;
  traducao?: string;
};

interface IRespostaFrases {
  frases: IFrases[];
  audioUrl: string | null;
}

interface Exemplos {
  english: string;
  portuguese: string;
}

interface AnaliseFraseIA {
  traducao: string;
  usoNativo: string;
  gramatica: string[];
  exemplos: Exemplos[];
  observacoes: string[];
}

export type { IFrases, IRespostaFrases, AnaliseFraseIA };
