import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../usuario.model';
import { UsuarioAdapter } from '../../../shared/adapters/usuario-adapter';
import { Result } from '../../../shared/models/result.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { AuthService } from '../../../core/services/AuthService';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/Auth';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Result<Usuario[]>>(this.apiUrl).pipe(
      map(r => (r.dados || []).map(u => UsuarioAdapter.fromApi(u)))
    );
  }

  getAllPage(
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'userName',
    direction: string = 'ASC',
    search: string = ''
  ) {
    const idEmpresa = this.authService.getUserEmpresaId();
    const nomeUsuario = this.authService.getUserName();
    const userRole = this.authService.getUserRole();
    
    const serverPage = (Number(page) || 0) + 1;
    let params = new HttpParams()
      .set('page', serverPage)
      .set('pageSize', pageSize)
      .set('orderBy', orderBy)
      .set('direction', direction)
      .set('userName', search);

    userRole === 'Suporte' ? params = params.set('empresaId', 0)
      : idEmpresa !== null ? params = params.set('empresaId', idEmpresa) : params = params.set('empresaId', 0);

    nomeUsuario !== null && userRole !== 'Suporte' ? params = params.set('userName', nomeUsuario) : params = params.set('userName', '');

    return this.http.get<PaginatedResponse<Usuario>>(`${this.apiUrl}/paginado`, { params }).pipe(
          map(response => {
            if (!response) return response as any;
    
            const respDados: any = response.dados || {};
            const items = Array.isArray(respDados.items) ? respDados.items.map((i: any) => UsuarioAdapter.fromApi(i)) : [];
    
            const serverPageIndex = respDados.pageIndex ?? respDados.pageNumber ?? 1;
            const normalizedPageIndex = Number(serverPageIndex) > 0 ? Number(serverPageIndex) - 1 : 0;
    
            const normalizedPageSize = respDados.pageSize ?? respDados.linesPerPage ?? pageSize;
            const normalizedTotalCount = respDados.totalCount ?? 0;
    
            const mapped = {
              ...response,
              dados: {
                items,
                totalCount: normalizedTotalCount,
                pageIndex: normalizedPageIndex,
                pageSize: Number(normalizedPageSize)
              }
            } as PaginatedResponse<Usuario>;
    
            return mapped;
          })
        );
      }
  
  getId(id: string): Observable<Usuario> {
    return this.http.get<Result<Usuario>>(`${this.apiUrl}/${id}`).pipe(
      map(r => UsuarioAdapter.fromApi(r.dados))
    );
  }

  criar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/criar-usuario`, usuario);
  }

  atualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
