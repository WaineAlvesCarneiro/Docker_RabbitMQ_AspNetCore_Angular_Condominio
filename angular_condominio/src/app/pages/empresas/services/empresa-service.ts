import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Empresa } from '../empresa.model';
import { EmpresaAdapter } from '../../../shared/adapters/empresa-adapter';
import { Result } from '../../../shared/models/result.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private apiUrl = environment.apiUrl + '/Empresa';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Empresa[]> {
    return this.http.get<Result<Empresa[]>>(this.apiUrl).pipe(
      map(r => (r.dados || []).map(e => EmpresaAdapter.fromApi(e)))
    );
  }

  getAllPage(
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'razaoSocial',
    direction: string = 'ASC',
    search: string = ''
  ) {
    const serverPage = (Number(page) || 0) + 1;
    let params = new HttpParams()
      .set('page', serverPage)
      .set('pageSize', pageSize)
      .set('orderBy', orderBy)
      .set('direction', direction)
      .set('search', search);

    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/paginado`, { params }).pipe(
      map(response => {
        if (!response) return response as any;

        const respDados: any = response.dados || {};
        const items = Array.isArray(respDados.items) ? respDados.items.map((i: any) => EmpresaAdapter.fromApi(i)) : [];

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
        } as PaginatedResponse<Empresa>;

        return mapped;
      })
    );
  }

  getId(id: string): Observable<Empresa> {
    return this.http.get<Result<Empresa>>(`${this.apiUrl}/${id}`).pipe(
      map(r => EmpresaAdapter.fromApi(r.dados))
    );
  }

  criar(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  atualizar(empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${empresa.id}`, empresa);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
