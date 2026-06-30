import { Imovel } from '../../pages/imoveis/imovel.model';

export class ImovelAdapter {
  static fromApi(apiData: any): Imovel {
    return {
      id: apiData.id,
      bloco: apiData.bloco,
      apartamento: apiData.apartamento,
      boxGaragem: apiData.boxGaragem,
      empresaId: apiData.empresaId
    };
  }
}
