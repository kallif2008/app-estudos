interface IEstudos {
  idTema: string;
  titulo: string;
  descricao: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  nomeAgente: string;
  idAgente: string;
  tradutor: boolean;
  idAgenteExplicacao?: string;
  _id: string;
}

interface IRespostaEstudos {
  data: IEstudos[];
}

export type { IEstudos, IRespostaEstudos };
