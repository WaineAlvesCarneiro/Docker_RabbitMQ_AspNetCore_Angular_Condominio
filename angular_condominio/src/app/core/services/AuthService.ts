import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../shared/models/auth-response.model';
import { LoginCredentials } from '../../shared/models/login-credentials.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private readonly TOKEN_KEY = 'jwt_token';

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  definirSenha(novaSenha: string) {
    return this.http.post(`${this.apiUrl}/Auth/definir-senha-permanente`, { NovaSenha: novaSenha });
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const nome = payload["unique_name"] || payload["UserName"] || payload["userName"];
      return nome ? String(nome) : null;
    } catch (e) {
      console.error("Erro ao decodificar token", e);
      return null;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload['role'] || null;
    } catch (e) {
      console.error('Erro ao decodificar token', e);
      return null;
    }
  }

  getUserEmpresaId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const empresa = payload['EmpresaId'] || payload['empresaId'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/EmpresaId'];
      return empresa ? Number(empresa) : null;
    } catch (e) {
      console.error('Erro ao decodificar token', e);
      return null;
    }
  }
}
