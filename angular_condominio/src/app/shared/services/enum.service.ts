import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EnumOption {
  value: number;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class EnumService {
  private apiUrl = environment.apiUrl + '/Enums';
   
  constructor(private http: HttpClient) { }

  private loadEnumArray(endpoint: string): Observable<EnumOption[]> {
    return this.http.get<EnumOption[]>(`${this.apiUrl}/${endpoint}`).pipe(
      map(response => {
        return response.map(item => ({
          value: item.value ?? item.value,
          label: item.label ?? item.label
        }));
      }),
      shareReplay(1)
    );
  }

  private loadEnumMap(endpoint: string): Observable<Map<number, string>> {
    return this.http.get<EnumOption[]>(`${this.apiUrl}/${endpoint}`).pipe(
      map(response => {
        return new Map(response.map(item => [item.value ?? item.value, item.label ?? item.label]));
      }),
      shareReplay(1)
    );
  }

  getTipoRoleArray(): Observable<EnumOption[]> { return this.loadEnumArray('tipo-role'); }
  getTipoRoleMap(): Observable<Map<number, string>> { return this.loadEnumMap('tipo-role'); }

  getTipoUserAtivoArray(): Observable<EnumOption[]> { return this.loadEnumArray('tipo-user-ativo'); }
  getTipoUserAtivoMap(): Observable<Map<number, string>> { return this.loadEnumMap('tipo-user-ativo'); }

  getTipoEmpresaAtivoArray(): Observable<EnumOption[]> { return this.loadEnumArray('tipo-empresa-ativo'); }
  getTipoEmpresaAtivoMap(): Observable<Map<number, string>> { return this.loadEnumMap('tipo-empresa-ativo'); }

  getTipoCondominioArray(): Observable<EnumOption[]> { return this.loadEnumArray('tipo-condominio'); }
  getTipoCondominioMap(): Observable<Map<number, string>> { return this.loadEnumMap('tipo-condominio'); }
}
