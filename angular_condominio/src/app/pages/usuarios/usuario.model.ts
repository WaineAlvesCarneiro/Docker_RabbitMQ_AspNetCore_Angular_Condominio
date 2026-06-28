export interface Usuario {
  id?: string;
  ativo: number;
  empresaAtiva: number;
  empresaId?: number | null;
  userName: string;
  email: string | null;
  primeiroAcesso?: boolean;
  role: number;
  dataInclusao?: string | null;
  dataAlteracao?: string | null;
  empresaDto?: {
    id?: number;
    razaoSocial?: string;
    fantasia?: string;
  };
}
