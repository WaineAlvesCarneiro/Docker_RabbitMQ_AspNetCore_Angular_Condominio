export interface Empresa {
  id?: string;
  ativo: number;
  razaoSocial: string;
  fantasia: string;
  cnpj: string;
  tipoDeCondominio: number;
  nome: string;
  celular: string;
  telefone: string | null;
  email: string;
  senha: string;
  host: string;
  porta: number;
  cep: string;
  uf: string;
  cidade: string;
  endereco: string;
  bairro: string;
  complemento: string | null;
  dataInclusao: string | null;
  dataAlteracao: string | null;
}

