import { Empresa } from '../../pages/empresas/empresa.model';
import { formatarDataParaInput, formatarDataParaApi } from '../utils/date-utils';

export class EmpresaAdapter {
  static fromApi(apiData: any): Empresa {
    return {
      id: apiData.id,
      ativo: apiData.ativo,
      razaoSocial: apiData.razaoSocial,
      fantasia: apiData.fantasia,
      cnpj: apiData.cnpj,
      tipoDeCondominio: apiData.tipoDeCondominio,
      nome: apiData.nome,
      celular: apiData.celular,
      telefone: apiData.telefone ?? null,
      email: apiData.email,
      senha: apiData.senha ?? null,
      host: apiData.host,
      porta: apiData.porta,
      cep: apiData.cep,
      uf: apiData.uf,
      cidade: apiData.cidade,
      endereco: apiData.endereco,
      bairro: apiData.bairro,
      complemento: apiData.complemento ?? null,
      dataInclusao: apiData.dataInclusao ? formatarDataParaInput(apiData.dataInclusao) : null,
      dataAlteracao: apiData.dataAlteracao ? formatarDataParaInput(apiData.dataAlteracao) : null
    };
  }
}
