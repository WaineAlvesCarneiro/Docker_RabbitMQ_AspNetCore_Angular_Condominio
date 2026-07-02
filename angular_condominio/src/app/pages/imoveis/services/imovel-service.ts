import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { environment } from '../../../../environments/environment';
import { Imovel } from '../imovel.model';
import { ImovelAdapter } from '../../../shared/adapters/imovel-adapter';

@Injectable({
  providedIn: 'root'
})
export class ImovelService {
  private apiUrl = environment.apiUrl + '/imovel';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Imovel[]> {
    return this.http.get<Result<Imovel[]>>(this.apiUrl).pipe(
      map(r => (r.dados || []).map(e => ImovelAdapter.fromApi(e)))
    );
  }
  
  getAllPage(
    page: number = 0,
    pageSize: number = 10,
    orderBy: string = 'bloco',
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
        const items = Array.isArray(respDados.items) ? respDados.items.map((i: any) => ImovelAdapter.fromApi(i)) : [];

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
        } as PaginatedResponse<Imovel>;

        return mapped;
      })
    );
  }

  getId(id: string): Observable<Imovel> {
    return this.http.get<Result<Imovel>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.dados)
    );
  }

  criar(imovel: Imovel): Observable<Imovel> {
    return this.http.post<Imovel>(this.apiUrl, imovel);
  }

  atualizar(imovel: Imovel): Observable<Imovel> {
    return this.http.put<Imovel>(`${this.apiUrl}/${imovel.id}`, imovel);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
