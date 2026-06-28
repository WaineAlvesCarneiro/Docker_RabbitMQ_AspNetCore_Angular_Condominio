import { formatarDataParaInput, formatarDataParaApi } from '../utils/date-utils';
import { Usuario } from '../../pages/usuarios/usuario.model';

export class UsuarioAdapter {
  static fromApi(apiData: any): Usuario {
    return {
      id: apiData.id,
      ativo: apiData.ativo,
      empresaAtiva: apiData.empresaAtiva,
      empresaId: apiData.empresaId,
      userName: apiData.userName,
      email: apiData.email,
      primeiroAcesso: apiData.primeiroAcesso,
      role: apiData.role,
      dataInclusao: apiData.dataInclusao ? formatarDataParaInput(apiData.dataInclusao) : null,
      dataAlteracao: apiData.dataAlteracao ? formatarDataParaInput(apiData.dataAlteracao) : null,
      empresaDto: apiData.empresaDto
    };
  }
}
