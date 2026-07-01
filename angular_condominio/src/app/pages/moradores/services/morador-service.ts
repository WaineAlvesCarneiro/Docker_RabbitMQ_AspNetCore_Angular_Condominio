import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { environment } from '../../../../environments/environment';
import { Morador } from '../morador.model';
import { MoradorAdapter } from '../../../shared/adapters/morador-adapter';
import { AuthService } from '../../../core/services/AuthService';

@Injectable({ providedIn: 'root' })
export class MoradorService {
  private apiUrl = environment.apiUrl + '/morador';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(): Observable<Morador[]> {
    return this.http.get<Result<Morador[]>>(this.apiUrl).pipe(
      map(r => (r.dados || []).map(u => MoradorAdapter.fromApi(u)))
    );
  }

  getAllPage(
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'nome',
    direction: string = 'ASC',
    nome: string = ''
  ) {
    const serverPage = (Number(page) || 0) + 1;
    const idEmpresa = this.authService.getUserEmpresaId();

    let params = new HttpParams()
      .set('page', serverPage)
      .set('pageSize', pageSize)
      .set('orderBy', orderBy)
      .set('direction', direction)
      .set('nome', nome);

    idEmpresa !== null ? params = params.set('empresaId', idEmpresa) : params = params.set('empresaId', 0);

    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/paginado`, { params }).pipe(
      map(response => {
        if (!response) return response as any;

        const respDados: any = response.dados || {};
        const items = Array.isArray(respDados.items) ? respDados.items.map((i: any) => MoradorAdapter.fromApi(i)) : [];

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
        } as PaginatedResponse<Morador>;

        return mapped;
      })
    );
  }

  getId(id: string): Observable<Morador> {
    return this.http.get<Result<Morador>>(`${this.apiUrl}/${id}`).pipe(
      map(r => MoradorAdapter.fromApi(r.dados))
    );
  }

  criar(morador: Morador): Observable<Morador> {
    return this.http.post<Morador>(this.apiUrl, morador);
  }

  atualizar(morador: Morador): Observable<Morador> {
    return this.http.put<Morador>(`${this.apiUrl}/${morador.id}`, morador);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
