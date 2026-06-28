import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Empresa } from '../empresa.model';
import { EmpresaAdapter } from '../../../shared/adapters/empresa-adapter';

interface Result<T> { sucesso: boolean; dados?: T; erro?: string }

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private apiUrl = environment.apiUrl + '/Empresa';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Empresa[]> {
    return this.http.get<Result<Empresa[]>>(this.apiUrl).pipe(
      map(r => (r.dados || []).map(e => EmpresaAdapter.fromApi(e)))
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
