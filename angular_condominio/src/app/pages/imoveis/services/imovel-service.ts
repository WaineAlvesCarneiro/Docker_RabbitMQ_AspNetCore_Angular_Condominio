import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getAllPage(page: number = 0, pageSize: number = 10, orderBy: string = 'id', direction: string = 'ASC') {
    const params = {
      page: page,
      pageSize: pageSize,
      orderBy: orderBy,
      direction: direction
    };

    return this.http.get<PaginatedResponse<Imovel>>(`${this.apiUrl}/paginado`, { params });
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
